"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { sanitizeText } from "@/lib/sanitize";

type Post = {
  id: string;
  content: string;
  status: string;
  redirectReason: string | null;
  createdAt: string;
  author: { id: string; nickname: string };
  _count: { likes: number };
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:  { label: "검토중", color: "bg-yellow-100 text-yellow-700" },
  APPROVED: { label: "공개",   color: "bg-green-100 text-green-700" },
  REDIRECT: { label: "전환",   color: "bg-orange-100 text-orange-700" },
  REJECTED: { label: "거절",   color: "bg-red-100 text-red-700" },
  ARCHIVED: { label: "보관",   color: "bg-gray-100 text-gray-500" },
};

export default function MyPostsPage() {
  const { data: session, status: authStatus } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    const res = await fetch("/api/post?mine=true");
    if (!res.ok) { setError("글 목록을 불러오지 못했어요."); return; }
    setPosts(await res.json());
  };

  useEffect(() => {
    if (session?.user) fetchPosts();
  }, [session]);

  if (authStatus === "loading") return <p className="py-12 text-center text-gray-400">...</p>;
  if (!session?.user) {
    return (
      <main className="py-12 text-center">
        <p className="text-sm text-gray-600">로그인이 필요해요.</p>
        <Link href="/plaza" className="mt-2 inline-block text-sm text-purple-600 underline">광장으로</Link>
      </main>
    );
  }

  const startEdit = (post: Post) => {
    setEditingId(post.id);
    setEditContent(post.content);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleResubmit = async (id: string) => {
    const content = sanitizeText(editContent).trim();
    if (!content) { setError("내용을 입력해주세요."); return; }
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/post", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "재제출에 실패했어요.");
      setSubmitting(false);
      return;
    }

    setEditingId(null);
    setEditContent("");
    setSubmitting(false);
    fetchPosts();
  };

  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">내 글</h2>
        <Link href="/plaza" className="rounded-lg border border-purple-400 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50">
          광장으로
        </Link>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      {posts.length === 0 ? (
        <div className="py-8 text-center">
          <p className="mb-3 text-sm text-gray-400">아직 작성한 글이 없어요.</p>
          <Link href="/plaza/new" className="text-sm text-purple-600 underline">첫 글 쓰기</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const badge = STATUS_LABELS[post.status] ?? { label: post.status, color: "bg-gray-100 text-gray-500" };
            const canResubmit = post.status === "REDIRECT" || post.status === "ARCHIVED";
            const isEditing = editingId === post.id;

            return (
              <div key={post.id} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${badge.color}`}>{badge.label}</span>
                  <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
                </div>

                {/* REDIRECT/ARCHIVED 사유 표시 */}
                {post.redirectReason && (
                  <div className="rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-700">
                    {post.redirectReason}
                  </div>
                )}

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResubmit(post.id)}
                        disabled={submitting || !editContent.trim()}
                        className="rounded-lg bg-purple-500 px-3 py-1.5 text-sm text-white hover:bg-purple-600 disabled:opacity-50"
                      >
                        {submitting ? "제출 중..." : "수정해서 다시 제출"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                    {canResubmit && (
                      <button
                        onClick={() => startEdit(post)}
                        className="rounded-lg border border-purple-300 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50"
                      >
                        수정 후 재제출
                      </button>
                    )}
                    {post.status === "APPROVED" && post._count.likes > 0 && (
                      <span className="text-xs text-gray-400">♥ {post._count.likes}</span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
