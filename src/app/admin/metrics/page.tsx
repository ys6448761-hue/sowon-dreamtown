"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/lib/admin";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

type Metrics = {
  range: string;
  kpi: {
    approvalRate: number;
    redirectRate: number;
    rejectionRate: number;
    medianReviewHours: number;
    p90ReviewHours: number;
    resubmitConversionRate: number;
  };
  trend: {
    dailyReviewCounts: { date: string; approved: number; redirected: number; rejected: number }[];
    dailyReviewTime: { date: string; p50: number | null; p90: number | null }[];
  };
  alerts: { type: string; message: string }[];
};

const ALERT_COLORS: Record<string, string> = {
  HIGH_P90: "bg-red-50 border-red-200 text-red-700",
  WARN_P90: "bg-yellow-50 border-yellow-200 text-yellow-700",
  QUEUE_BACKLOG: "bg-yellow-50 border-yellow-200 text-yellow-700",
  HIGH_REJECTION: "bg-yellow-50 border-yellow-200 text-yellow-700",
};

export default function AdminMetricsPage() {
  const { data: session, status: authStatus } = useSession();
  const [data, setData] = useState<Metrics | null>(null);
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const admin = authStatus !== "loading" && isAdmin(session?.user?.name);

  const fetchMetrics = async (r: string) => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/metrics?range=${r}`);
    if (!res.ok) { setError("메트릭스를 불러오지 못했어요."); setLoading(false); return; }
    setData(await res.json());
    setLoading(false);
  };

  useEffect(() => { if (admin) fetchMetrics(range); }, [admin, range]);

  if (authStatus === "loading") return <p className="py-12 text-center text-gray-400">...</p>;
  if (!admin) return <main className="py-12 text-center"><p className="text-lg font-medium text-red-600">접근 권한이 없습니다</p></main>;

  const kpi = data?.kpi;

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">운영 메트릭스</h2>
          <p className="text-xs text-gray-500">나눔 검증 파이프라인 KPI</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setRange("7d")}
            className={`rounded-lg px-3 py-1.5 text-sm ${range === "7d" ? "bg-purple-500 text-white" : "border hover:bg-gray-50"}`}
          >7일</button>
          <button
            onClick={() => setRange("30d")}
            className={`rounded-lg px-3 py-1.5 text-sm ${range === "30d" ? "bg-purple-500 text-white" : "border hover:bg-gray-50"}`}
          >30일</button>
          <Link href="/admin" className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">Admin</Link>
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="py-8 text-center text-sm text-gray-400">불러오는 중...</p>
      ) : kpi ? (
        <>
          {/* Alerts */}
          {data!.alerts.length > 0 && (
            <div className="space-y-2">
              {data!.alerts.map((alert, i) => (
                <div key={i} className={`rounded-lg border px-4 py-2 text-sm ${ALERT_COLORS[alert.type] ?? "bg-gray-50 border-gray-200 text-gray-700"}`}>
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <KpiCard label="승인율" value={pct(kpi.approvalRate)} sub="APPROVED / 전체 검토" color="text-green-700" />
            <KpiCard label="전환율" value={pct(kpi.redirectRate)} sub="REDIRECT / 전체 검토" color="text-orange-600" />
            <KpiCard label="거절율" value={pct(kpi.rejectionRate)} sub="REJECTED / 전체 검토" color="text-red-600" />
            <KpiCard label="검토 시간 (p50)" value={hrs(kpi.medianReviewHours)} sub="작성→검토 중앙값" color="text-purple-700" />
            <KpiCard label="검토 시간 (p90)" value={hrs(kpi.p90ReviewHours)} sub="90% 이내 완료" color="text-purple-700" />
            <KpiCard label="재제출 전환" value={pct(kpi.resubmitConversionRate)} sub="전환 후 재제출" color="text-blue-600" />
          </div>

          {/* Chart: Daily Review Counts */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-sm font-medium">일별 검토 현황</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data!.trend.dailyReviewCounts.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="approved" name="승인" fill="#9B87F5" radius={[2, 2, 0, 0]} />
                <Bar dataKey="redirected" name="전환" fill="#F5A7C6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="rejected" name="거절" fill="#d1d5db" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart: Daily Review Time */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-sm font-medium">일별 검토 시간 (시간)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data!.trend.dailyReviewTime.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="p50" name="p50" stroke="#9B87F5" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                <Line type="monotone" dataKey="p90" name="p90" stroke="#6E59A5" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : null}
    </main>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}

function pct(n: number): string {
  return n > 0 ? `${(n * 100).toFixed(1)}%` : "—";
}

function hrs(n: number): string {
  return n > 0 ? `${n}h` : "—";
}
