"use client";

import Link from "next/link";

function logEvent(eventName: string) {
  fetch("/api/plaza/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_type: eventName }),
  }).catch(() => {});
}

export default function Home() {
  return (
    <main className="space-y-8 py-12 text-center">
      <h2 className="text-3xl font-bold">소원을 나누고, 함께 응원해요</h2>
      <div className="flex justify-center gap-4">
        <Link
          href="/plaza"
          className="rounded-lg bg-purple-500 px-6 py-3 text-white hover:bg-purple-600"
          onClick={() => logEvent("plaza_click")}
        >
          광장 가기
        </Link>
        <Link
          href="/events"
          className="rounded-lg border border-purple-300 px-6 py-3 text-purple-600 hover:bg-purple-50"
          onClick={() => logEvent("events_view")}
        >
          이벤트 보기
        </Link>
      </div>
    </main>
  );
}
