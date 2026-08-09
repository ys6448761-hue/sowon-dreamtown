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
      <div className="flex flex-col items-center gap-4">
        <Link
          href="/checkin?mode=new"
          className="rounded-full bg-[#9B87F5] px-8 py-3.5 text-sm font-medium text-white hover:bg-[#8b77e5]"
          onClick={() => logEvent("new_star_click")}
        >
          + 새 별 만들기
        </Link>
        <div className="flex justify-center gap-4">
          <Link
            href="/plaza"
            className="rounded-lg border border-purple-300 px-6 py-3 text-purple-600 hover:bg-purple-50"
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
      </div>
    </main>
  );
}
