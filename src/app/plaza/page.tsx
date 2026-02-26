"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; nickname: string };
  _count: { likes: number };
};

export default function PlazaPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    const res = await fetch("/api/post");
    if (!res.ok) { setError("글 목록을 불러오지 못했어요."); return; }
    setPosts(await res.json());
  };

  useEffect(() => { fetchPosts(); }, []);

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
        <h2 className="text-xl font-bold">광장</h2>
        {session?.user && (
          <Link href="/plaza/new" className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600">글쓰기</Link>
        )}
      </div>
      {session?.user && posts.length === 0 && (
        <Link href="/plaza/new" className="mb-4 block rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 p-5 text-center hover:bg-purple-100">
          <p className="mb-1 text-sm text-purple-700">오늘의 질문</p>
          <p className="mb-3 font-medium text-purple-900">오늘 팬으로서 가장 설레는 순간은 언제였나요?</p>
          <span className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white">첫 글 쓰기</span>
        </Link>
      )}
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg border p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">{post.author.nickname}</span>
              <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
            </div>
            <p className="mb-2 text-sm">{post.content}</p>
            <button onClick={() => handleLike(post.id)} className="text-xs text-gray-500 hover:text-purple-500">
              {post._count.likes > 0 ? `♥ ${post._count.likes}` : "♡ 좋아요"}
            </button>
          </div>
        ))}
        {posts.length === 0 && <p className="py-8 text-center text-sm text-gray-400">아직 글이 없어요</p>}
      </div>
    </main>
  );
}
