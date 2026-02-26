"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Post = {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  author: { id: string; nickname: string };
  _count: { likes: number };
};

export default function PlazaPage() {
  return (
    <Suspense fallback={<main><p className="py-8 text-center text-sm text-gray-400">불러오는 중...</p></main>}>
      <PlazaContent />
    </Suspense>
  );
}

function PlazaContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const mine = searchParams.get("mine") === "true";
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasPending, setHasPending] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    const url = mine ? "/api/post?mine=true" : "/api/post";
    const res = await fetch(url);
    if (!res.ok) { setError("글 목록을 불러오지 못했어요."); return; }
    setPosts(await res.json());
  };

  // 공개 피드 비어있을 때 본인 PENDING 글 있는지 확인
  const checkPending = async () => {
    if (mine || !session?.user) return;
    const res = await fetch("/api/post?mine=true");
    if (!res.ok) return;
    const myPosts: Post[] = await res.json();
    setHasPending(myPosts.some((p) => p.status === "PENDING"));
  };

  useEffect(() => { fetchPosts(); }, [mine]);
  useEffect(() => {
    if (posts.length === 0 && session?.user && !mine) checkPending();
  }, [posts, session, mine]);

  const handleLike = async (postId: string) => {
    setError("");
    const res = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    if (res.status === 401) { setError("좋아요하려면 로그인이 필요해요."); return; }
    if (!res.ok) { setError("좋아요에 실패했어요."); return; }
    fetchPosts();
  };

  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">{mine ? "내 글" : "광장"}</h2>
        <div className="flex gap-2">
          {mine && (
            <Link href="/plaza" className="rounded-lg border border-purple-400 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50">
              전체 보기
            </Link>
          )}
          {session?.user && (
            <Link href="/plaza/new" className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600">글쓰기</Link>
          )}
        </div>
      </div>

      {/* CTA: 공개 피드 비어있을 때 */}
      {!mine && session?.user && posts.length === 0 && !hasPending && (
        <Link href="/plaza/new" className="mb-4 block rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 p-5 text-center hover:bg-purple-100">
          <p className="mb-1 text-sm text-purple-700">오늘의 질문</p>
          <p className="mb-3 font-medium text-purple-900">오늘 팬으로서 가장 설레는 순간은 언제였나요?</p>
          <span className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white">첫 글 쓰기</span>
        </Link>
      )}
      {!mine && session?.user && posts.length === 0 && hasPending && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
          <p className="text-sm text-yellow-800">검토중인 글이 있어요</p>
          <Link href="/plaza?mine=true" className="mt-2 inline-block text-sm text-purple-600 underline hover:text-purple-800">
            내 글 확인하기
          </Link>
        </div>
      )}

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg border p-4">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{post.author.nickname}</span>
                {mine && post.status === "PENDING" && (
                  <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">검토중</span>
                )}
              </div>
              <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
            </div>
            <p className="mb-2 text-sm">{post.content}</p>
            {post.status === "APPROVED" && (
              <button onClick={() => handleLike(post.id)} className="text-xs text-gray-500 hover:text-purple-500">
                {post._count.likes > 0 ? `♥ ${post._count.likes}` : "♡ 좋아요"}
              </button>
            )}
          </div>
        ))}
        {posts.length === 0 && !hasPending && <p className="py-8 text-center text-sm text-gray-400">아직 글이 없어요</p>}
      </div>
    </main>
  );
}
