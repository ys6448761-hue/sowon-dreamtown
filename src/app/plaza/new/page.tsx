"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function NewPostPage() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ id: string } | null>(null);

  if (!session?.user) {
    return (
      <main className="py-12 text-center">
        <p className="text-gray-500">로그인 후 글을 작성할 수 있어요.</p>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="py-12 text-center">
        <div className="mx-auto max-w-sm space-y-4">
          <div className="text-4xl">✨</div>
          <h2 className="text-xl font-bold text-purple-700">검토중이에요</h2>
          <p className="text-sm text-gray-600">
            오로라 5가 따뜻하게 확인하고 있어요.
          </p>
          <p className="text-xs text-gray-400">
            승인되면 나눔에 공개됩니다.
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <Link
              href="/plaza?mine=true"
              className="rounded-lg border border-purple-400 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
            >
              내 글 확인
            </Link>
            <Link
              href="/plaza"
              className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600"
            >
              다른 나눔 보기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      setError("글 작성에 실패했어요. 다시 시도해주세요.");
      setSubmitting(false);
      return;
    }

    const post = await res.json();
    setSubmitted({ id: post.id });
  };

  return (
    <main>
      <h2 className="mb-6 text-xl font-bold">글쓰기</h2>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="무슨 소원을 품고 있나요?"
          rows={5}
          className="w-full rounded-lg border px-4 py-3 text-sm focus:border-purple-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="rounded-lg bg-purple-500 px-6 py-2 text-sm text-white hover:bg-purple-600 disabled:opacity-50"
        >
          {submitting ? "작성 중..." : "작성하기"}
        </button>
      </form>
    </main>
  );
}
