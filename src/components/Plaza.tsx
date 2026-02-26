"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; nickname: string };
  _count: { likes: number };
};

export default function Plaza() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");

  const fetchPosts = async () => {
    const res = await fetch("/api/post");
    setPosts(await res.json());
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const res = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) { setContent(""); fetchPosts(); }
  };

  const handleLike = async (postId: string) => {
    const res = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    if (res.ok) fetchPosts();
  };

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">광장</h2>

      {session?.user && (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="무슨 소원을 품고 있나요?"
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600"
          >
            작성
          </button>
        </form>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg border p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">{post.author.nickname}</span>
              <span className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <p className="mb-2 text-sm">{post.content}</p>
            <button
              onClick={() => handleLike(post.id)}
              className="text-xs text-gray-500 hover:text-purple-500"
            >
              {post._count.likes > 0 ? `♥ ${post._count.likes}` : "♡ 좋아요"}
            </button>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">아직 글이 없어요</p>
        )}
      </div>
    </section>
  );
}
