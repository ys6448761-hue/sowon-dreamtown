"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/lib/admin";
import { useEffect, useState } from "react";

type ReviewPost = {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  author: { id: string; nickname: string };
};

export default function AdminPostsPage() {
  const { data: session, status: authStatus } = useSession();
  const [posts, setPosts] = useState<ReviewPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openRedirectId, setOpenRedirectId] = useState<string | null>(null);
  const [redirectReason, setRedirectReason] = useState("");

  const admin = authStatus !== "loading" && isAdmin(session?.user?.name);

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/posts");
    if (!res.ok) { setError("목록을 불러오지 못했어요."); setLoading(false); return; }
    const data = await res.json();
    setPosts(data.posts ?? []);
    setLoading(false);
  };

  useEffect(() => { if (admin) fetchPosts(); }, [admin]);

  if (authStatus === "loading") return <p className="py-12 text-center text-gray-400">...</p>;
  if (!admin) {
    return (
      <main className="py-12 text-center">
        <p className="text-lg font-medium text-red-600">접근 권한이 없습니다</p>
      </main>
    );
  }

  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
    setError("");
    const res = await fetch("/api/admin/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "처리에 실패했어요.");
      return;
    }
    fetchPosts();
  };

  const handleRedirect = async (id: string) => {
    setError("");
    const reason = redirectReason.trim();
    if (!reason) { setError("전환 사유를 입력해주세요."); return; }

    const res = await fetch("/api/admin/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "REDIRECT", redirectReason: reason }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "전환에 실패했어요.");
      return;
    }
    setOpenRedirectId(null);
    setRedirectReason("");
    fetchPosts();
  };

  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">나눔 검토</h2>
          <p className="text-xs text-gray-500">PENDING 최신 50개</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="rounded-lg border border-purple-400 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50">
            Admin
          </Link>
          <button onClick={fetchPosts} disabled={loading} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
            새로고침
          </button>
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="py-8 text-center text-sm text-gray-400">불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">검토할 글이 없어요</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{post.author.nickname}</span>
                  <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">PENDING</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
              </div>

              <p className="text-sm whitespace-pre-wrap" style={{ display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {post.content}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(post.id, "APPROVE")}
                  className="rounded-lg bg-purple-500 px-3 py-1.5 text-sm text-white hover:bg-purple-600"
                >
                  승인
                </button>
                <button
                  onClick={() => {
                    setError("");
                    setOpenRedirectId(openRedirectId === post.id ? null : post.id);
                    setRedirectReason("");
                  }}
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  전환
                </button>
                <button
                  onClick={() => handleAction(post.id, "REJECT")}
                  className="rounded-lg border px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
                >
                  거절
                </button>
              </div>

              {openRedirectId === post.id && (
                <div className="rounded-lg border bg-gray-50 p-3 space-y-2">
                  <p className="text-xs text-gray-600">전환 사유 (1줄)</p>
                  <textarea
                    value={redirectReason}
                    onChange={(e) => setRedirectReason(e.target.value)}
                    placeholder="예: 나눔 공간에서는 비난/단정 표현을 줄여요. 조금 더 따뜻하게 다듬어주세요."
                    rows={2}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRedirect(post.id)}
                      className="rounded-lg bg-purple-500 px-3 py-1.5 text-sm text-white hover:bg-purple-600"
                    >
                      전환 확정
                    </button>
                    <button
                      onClick={() => setOpenRedirectId(null)}
                      className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
