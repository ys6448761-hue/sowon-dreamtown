import AuthButton from "@/components/AuthButton";
import Plaza from "@/components/Plaza";
import EventList from "@/components/EventList";

export default function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-600">소원꿈터</h1>
        <AuthButton />
      </header>

      <main className="space-y-10">
        <Plaza />
        <EventList />
      </main>
    </div>
  );
}
