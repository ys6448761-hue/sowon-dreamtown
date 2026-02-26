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
  totalReviewed: number;
  kpi: {
    approvalRate: number;
    redirectRate: number;
    rejectionRate: number;
    medianReviewHours: number;
    p90ReviewHours: number;
    resubmitConversionRate: number;
    pendingQueue: number;
    oldestPendingHours: number | null;
  };
  prevKpi: {
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
  alerts: { type: string; severity: "red" | "yellow"; message: string }[];
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
  const prevKpi = data?.prevKpi;

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
          {/* Alerts — severity 정렬 (red first, API에서 정렬됨) */}
          {data!.alerts.length > 0 && (
            <div className="space-y-2">
              {data!.alerts.map((alert, i) => (
                <div key={i} className={`rounded-lg border px-4 py-2 text-sm ${
                  alert.severity === "red"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-yellow-200 bg-yellow-50 text-yellow-700"
                }`}>
                  <span className="mr-1.5">{alert.severity === "red" ? "\u{1F534}" : "\u{1F7E1}"}</span>
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          {/* 표본 적음 경고 */}
          {data!.totalReviewed < 20 && (
            <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500">
              표본 {data!.totalReviewed}건 — 20건 미만이므로 KPI 해석에 주의가 필요합니다.
            </p>
          )}

          {/* KPI Cards — 운영 우선순위 배치 */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {/* 1. p90 검토 시간 */}
            <KpiCard
              label="검토 시간 (p90)"
              value={hrs(kpi.p90ReviewHours)}
              sub="90% 이내 완료"
              dot={kpi.p90ReviewHours > 72 ? "red" : kpi.p90ReviewHours > 24 ? "yellow" : "green"}
              delta={deltaDiff(kpi.p90ReviewHours, prevKpi?.p90ReviewHours, "h", true)}
            />
            {/* 2. PENDING 대기 큐 → /admin/posts 링크 */}
            <Link href="/admin/posts" className="block">
              <KpiCard
                label="대기 큐 (PENDING)"
                value={`${kpi.pendingQueue}건`}
                sub={kpi.oldestPendingHours != null ? `최장 ${kpi.oldestPendingHours}h 대기` : "대기 없음"}
                dot={kpi.pendingQueue >= 20 ? "red" : kpi.pendingQueue >= 10 ? "yellow" : "green"}
                clickable
              />
            </Link>
            {/* 3. 승인률 */}
            <KpiCard
              label="승인률"
              value={pct(kpi.approvalRate)}
              sub="APPROVED / 전체"
              dot="green"
              delta={deltaDiff(kpi.approvalRate, prevKpi?.approvalRate, "%")}
            />
            {/* 4. 전환률 */}
            <KpiCard
              label="전환률"
              value={pct(kpi.redirectRate)}
              sub="REDIRECT / 전체"
              dot="yellow"
              delta={deltaDiff(kpi.redirectRate, prevKpi?.redirectRate, "%")}
            />
            {/* 5. 거절률 */}
            <KpiCard
              label="거절률"
              value={pct(kpi.rejectionRate)}
              sub="REJECTED / 전체"
              dot={kpi.rejectionRate > 0.3 ? "red" : "green"}
              delta={deltaDiff(kpi.rejectionRate, prevKpi?.rejectionRate, "%", true)}
            />
            {/* 6. 재제출 전환 */}
            <KpiCard
              label="재제출 전환"
              value={pct(kpi.resubmitConversionRate)}
              sub="전환 후 재제출"
              dot="green"
              delta={deltaDiff(kpi.resubmitConversionRate, prevKpi?.resubmitConversionRate, "%")}
            />
          </div>

          {/* Chart: Daily Review Counts (Stacked) */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-sm font-medium">일별 검토 현황</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data!.trend.dailyReviewCounts.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="approved" name="승인" stackId="a" fill="#9B87F5" />
                <Bar dataKey="redirected" name="전환" stackId="a" fill="#F5A7C6" />
                <Bar dataKey="rejected" name="거절" stackId="a" fill="#d1d5db" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-1.5 text-center text-[10px] text-gray-400">
              막대 하나 = 하루 총 검토 건수 (승인+전환+거절 합산)
            </p>
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
                <Line type="monotone" dataKey="p50" name="p50 (중앙값)" stroke="#9B87F5" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                <Line type="monotone" dataKey="p90" name="p90" stroke="#6E59A5" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
            <p className="mt-1.5 text-center text-[10px] text-gray-400">
              작성 시점 → 검토 완료까지 걸린 시간. p90이 24h 이내면 양호
            </p>
          </div>
        </>
      ) : null}
    </main>
  );
}

/* ── KPI Card ─────────────────────────────────────────── */

const DOT_COLOR: Record<string, string> = {
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
};

function KpiCard({ label, value, sub, dot, delta, clickable }: {
  label: string;
  value: string;
  sub: string;
  dot: "green" | "yellow" | "red";
  delta?: string | null;
  clickable?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-3 ${clickable ? "cursor-pointer hover:border-purple-300 hover:bg-purple-50/30" : ""}`}>
      <div className="flex items-center gap-1.5">
        <span className={`inline-block h-2 w-2 rounded-full ${DOT_COLOR[dot]}`} />
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <p className="text-lg font-bold text-gray-900">{value}</p>
        {delta && (
          <span className={`text-xs font-medium ${
            delta.startsWith("+") ? "text-green-600" : delta.startsWith("-") ? "text-red-500" : "text-gray-400"
          }`}>{delta}</span>
        )}
      </div>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────── */

function pct(n: number): string {
  return n > 0 ? `${(n * 100).toFixed(1)}%` : "\u2014";
}

function hrs(n: number): string {
  return n > 0 ? `${n}h` : "\u2014";
}

/**
 * 전기간 대비 증감 표시.
 * @param inverse true면 감소가 좋은 것 (p90, 거절률)
 */
function deltaDiff(
  current: number,
  prev: number | undefined,
  unit: "%" | "h",
  inverse?: boolean,
): string | null {
  if (prev == null || (current === 0 && prev === 0)) return null;
  const diff = current - prev;
  if (Math.abs(diff) < 0.005) return null;

  if (unit === "%") {
    const d = (diff * 100).toFixed(1);
    const sign = diff > 0 ? "+" : "";
    return `${sign}${d}%`;
  }
  // hours
  const d = diff.toFixed(1);
  const sign = diff > 0 ? "+" : "";
  return `${sign}${d}h`;
}
