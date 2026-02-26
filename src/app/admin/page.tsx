"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { isAdmin } from "@/lib/admin";

type Event = {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  _count: { participations: number };
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const admin = status !== "loading" && isAdmin(session?.user?.name);

  const fetchEvents = async () => {
    const res = await fetch("/api/admin/events");
    if (res.ok) setEvents(await res.json());
  };

  useEffect(() => { if (admin) fetchEvents(); }, [admin]);

  if (status === "loading") return <p className="py-12 text-center text-gray-400">...</p>;
  if (!admin) {
    return (
      <main className="py-12 text-center">
        <p className="text-lg font-medium text-red-600">접근 권한이 없습니다</p>
      </main>
    );
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
    });
    if (!res.ok) { setError("이벤트 생성에 실패했어요."); return; }
    setName(""); setDescription("");
    fetchEvents();
  };

  const handleDisable = async (id: string) => {
    setError("");
    const res = await fetch("/api/admin/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) { setError("비활성화에 실패했어요."); return; }
    fetchEvents();
  };

  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Admin</h2>
        <div className="flex gap-2">
          <Link href="/admin/metrics" className="rounded-lg border border-purple-400 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50">
            메트릭스
          </Link>
          <Link href="/admin/posts" className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600">
            나눔 검토
          </Link>
        </div>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleCreate} className="mb-8 space-y-3 rounded-lg border p-4">
        <h3 className="font-medium">이벤트 생성</h3>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="제목"
          className="w-full rounded-lg border px-3 py-2 text-sm focus:border-purple-400 focus:outline-none" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="설명 (선택)"
          rows={2} className="w-full rounded-lg border px-3 py-2 text-sm focus:border-purple-400 focus:outline-none" />
        <button type="submit" disabled={!name.trim()}
          className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600 disabled:opacity-50">생성</button>
      </form>

      <h3 className="mb-3 font-medium">이벤트 목록</h3>
      <div className="space-y-2">
        {events.map(ev => (
          <div key={ev.id} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <span className="text-sm font-medium">{ev.name}</span>
              <span className={`ml-2 rounded px-1.5 py-0.5 text-xs ${ev.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {ev.active ? "active" : "disabled"}
              </span>
              <span className="ml-2 text-xs text-gray-400">참여 {ev._count.participations}명</span>
            </div>
            {ev.active && (
              <button onClick={() => handleDisable(ev.id)} className="rounded bg-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-200">비활성화</button>
            )}
          </div>
        ))}
        {events.length === 0 && <p className="py-4 text-center text-sm text-gray-400">이벤트가 없어요</p>}
      </div>
    </main>
  );
}
