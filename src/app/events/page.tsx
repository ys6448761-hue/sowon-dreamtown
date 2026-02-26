"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Event = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count: { participations: number };
};

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    const res = await fetch("/api/event");
    if (!res.ok) { setError("이벤트를 불러오지 못했어요."); return; }
    setEvents(await res.json());
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleJoin = async (eventId: string) => {
    setError("");
    const res = await fetch(`/api/event/${eventId}/join`, { method: "POST" });
    if (res.status === 401) { setError("참여하려면 로그인이 필요해요."); return; }
    if (res.status === 409) { setError("이미 참여한 이벤트입니다."); return; }
    if (!res.ok) { setError("참여에 실패했어요."); return; }
    fetchEvents();
  };

  return (
    <main>
      <h2 className="mb-6 text-xl font-bold">이벤트</h2>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="space-y-3">
        {events.map((ev) => (
          <div key={ev.id} className="rounded-lg border p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium">{ev.name}</span>
              <span className="text-xs text-gray-400">
                참여 {ev._count.participations}명
              </span>
            </div>
            {ev.description && (
              <p className="mb-2 text-sm text-gray-600">{ev.description}</p>
            )}
            {session?.user && (
              <button
                onClick={() => handleJoin(ev.id)}
                className="rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-600 hover:bg-purple-200"
              >
                참여하기
              </button>
            )}
          </div>
        ))}
        {events.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">진행 중인 이벤트가 없어요</p>
        )}
      </div>
    </main>
  );
}
