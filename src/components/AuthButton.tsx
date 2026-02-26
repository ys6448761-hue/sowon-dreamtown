"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <span className="text-sm text-gray-400">...</span>;

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{session.user.name}</span>
        <button
          onClick={() => signOut()}
          className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        const nickname = prompt("닉네임을 입력하세요");
        if (nickname) signIn("credentials", { nickname, redirect: false });
      }}
      className="rounded-lg bg-purple-500 px-4 py-1.5 text-sm text-white hover:bg-purple-600"
    >
      로그인
    </button>
  );
}
