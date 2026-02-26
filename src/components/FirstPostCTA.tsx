"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function FirstPostCTA() {
  const { data: session } = useSession();
  const [hasPosted, setHasPosted] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/post")
      .then((res) => res.json())
      .then((posts) => {
        const myPost = posts.find(
          (p: { author: { id: string } }) => p.author.id === session.user.id
        );
        setHasPosted(!!myPost);
      });
  }, [session]);

  if (!session?.user || hasPosted) return null;

  return (
    <div className="rounded-xl border-2 border-dashed border-purple-300 bg-white p-5 text-center">
      <p className="mb-1 text-lg font-bold text-purple-600">
        첫 번째 글을 남겨보세요!
      </p>
      <p className="text-sm text-gray-500">
        소원꿈터에서의 첫 발자국, 아래 광장에서 소원을 적어주세요.
      </p>
    </div>
  );
}
