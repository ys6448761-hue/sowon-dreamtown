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

export default function EventList() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const res = await fetch("/api/event");
    setEvents(await res.json());
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleJoin = async (eventId: string) => {
    const res = await fetch(`/api/event/${eventId}/join`, { method: "POST" });
    if (res.ok) fetchEvents();
    else if (res.status === 409) alert("이미 참여한 이벤트입니다.");
  };

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">이벤트</h2>
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
    </section>
  );
}
