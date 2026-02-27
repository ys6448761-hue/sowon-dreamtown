"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { isAdmin } from "@/lib/admin";

export default function Header() {
  const { data: session, status } = useSession();
  const login = () => {
    const nickname = prompt("닉네임을 입력하세요");
    if (nickname) signIn("credentials", { nickname, redirect: false });
  };
  return (
    <header className="mb-8 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-purple-600">소원꿈터</Link>
      <nav className="flex items-center gap-4">
        <Link href="/plaza" className="text-sm hover:text-purple-600">광장</Link>
        <Link href="/events" className="text-sm hover:text-purple-600">이벤트</Link>
        {session?.user && (
          <Link href="/my/posts" className="text-sm hover:text-purple-600">내 글</Link>
        )}
        {session?.user && isAdmin(session.user.name) && (
          <Link href="/admin" className="text-sm font-medium text-purple-600 hover:text-purple-800">Admin</Link>
        )}
        {status === "loading" ? (
          <span className="text-sm text-gray-400">...</span>
        ) : session?.user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{session.user.name}</span>
            <button onClick={() => signOut()} className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300">
              로그아웃
            </button>
          </div>
        ) : (
          <button onClick={login} className="rounded-lg bg-purple-500 px-4 py-1.5 text-sm text-white hover:bg-purple-600">
            로그인
          </button>
        )}
      </nav>
    </header>
  );
}
