"use client";

import React, { useMemo, useState } from "react";

/**
 * AIL-2026-LUMI-ARTIFACT-001
 * Soft Launch Gate 판정 & CEO 보고서 자동화 아티팩트 (React 단일 파일)
 * - Tailwind CSS 유틸리티만 사용
 * - localStorage 금지 (state only)
 *
 * [FIX-001] API Key 경고 배너 추가 (코미, 2026-03-05)
 * [PROXY]   /api/ai 서버 프록시 전환 — 브라우저 직접 호출 금지 (루미, 2026-03-05)
 */

const KPI_TARGETS = {
  completionRate: 60,
  d1ReturnRate: 25,
  helpfulAvg: 4.0,
};

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function clampNumber(v, { min = -Infinity, max = Infinity } = {}) {
  const n = Number(v);
  if (Number.isNaN(n)) return "";
  return String(Math.min(max, Math.max(min, n)));
}

function pctBadge(value, target) {
  const n = Number(value);
  if (Number.isNaN(n)) return { ok: null, label: "-" };
  return { ok: n >= target, label: `${n.toFixed(1)}%` };
}

function numBadge(value, target) {
  const n = Number(value);
  if (Number.isNaN(n)) return { ok: null, label: "-" };
  return { ok: n >= target, label: `${n.toFixed(2)}` };
}

function kpiStatus({ completionRate, d1ReturnRate, helpfulAvg }) {
  const c = Number(completionRate);
  const d = Number(d1ReturnRate);
  const h = Number(helpfulAvg);

  const cOk = !Number.isNaN(c) && c >= KPI_TARGETS.completionRate;
  const dOk = !Number.isNaN(d) && d >= KPI_TARGETS.d1ReturnRate;
  const hOk = !Number.isNaN(h) && h >= KPI_TARGETS.helpfulAvg;

  const provided = !Number.isNaN(c) && !Number.isNaN(d) && !Number.isNaN(h);
  const okCount = [cOk, dOk, hOk].filter(Boolean).length;

  return { provided, okCount, cOk, dOk, hOk };
}

const DEFAULT_GATES = [
  { id: 1, title: "/healthz 응답", kind: "simple" },
  { id: 2, title: "정적 파일 (쿠키 없음)", kind: "simple" },
  { id: 3, title: "Beta Gate 차단/통과", kind: "simple" },
  {
    id: 4,
    title: "landing_view 기록",
    kind: "withNumber",
    numberLabel: "anon_user_id NULL 건수",
    numberHint: "0 이어야 함",
  },
  {
    id: 5,
    title: "진단 이벤트 3종",
    kind: "withChecks",
    checks: [
      { key: "start", label: "start_diagnosis" },
      { key: "submit", label: "submit_diagnosis" },
      { key: "result", label: "view_result" },
    ],
  },
  {
    id: 6,
    title: "결과 화면 렌더",
    kind: "withChecks",
    checks: [
      { key: "mode_name", label: "mode_name" },
      { key: "today_action_1", label: "today_action_1" },
    ],
  },
  { id: 7, title: "paywall_view 기록", kind: "simple" },
  { id: 8, title: "cta_click 기록", kind: "simple" },
  { id: 9, title: "피드백 row 생성", kind: "simple" },
  { id: 10, title: "return_next_day 순서", kind: "simple" },
  {
    id: 11,
    title: "error 이벤트 구조",
    kind: "withChecks",
    checks: [
      { key: "requestId", label: "requestId" },
      { key: "error_class", label: "error_class" },
      { key: "route", label: "route" },
    ],
  },
];

function initialGateState() {
  const state = {};
  for (const g of DEFAULT_GATES) {
    state[g.id] = {
      pass: true,
      exceptionApproved: false,
      numberValue: g.kind === "withNumber" ? "0" : "",
      checks:
        g.kind === "withChecks"
          ? Object.fromEntries(g.checks.map((c) => [c.key, true]))
          : {},
    };
  }
  return state;
}

function computeGateVerdict(gateState) {
  let hardFail = false;
  let failList = [];

  for (const g of DEFAULT_GATES) {
    const s = gateState[g.id];
    if (!s) continue;

    let effectivePass = Boolean(s.pass);

    if (g.kind === "withChecks") {
      const allChecked = Object.values(s.checks || {}).every(Boolean);
      if (!allChecked) effectivePass = false;
    }

    if (g.id === 4) {
      const n = Number(s.numberValue);
      if (!Number.isNaN(n) && n !== 0) effectivePass = false;
    }

    const isFail = !effectivePass;
    if (isFail) {
      failList.push(g.id);
      if (!s.exceptionApproved) hardFail = true;
    }
  }

  return { overall: hardFail ? "LAUNCH_HOLD" : "LAUNCH_OK", failList, hardFail };
}

function buildRunbookStyleReport({ deployUrl, gateState, kpis, errorTop3, issueNotes, aiJson, overrideVerdict }) {
  const gateLines = DEFAULT_GATES.map((g) => {
    const s = gateState[g.id];
    const base = `#${g.id} ${g.title}: ${s.pass ? "PASS" : "FAIL"}${
      s.exceptionApproved && !s.pass ? " (예외 승인)" : ""
    }`;
    if (g.kind === "withNumber") return `${base} | ${g.numberLabel}: ${s.numberValue ?? ""}`;
    if (g.kind === "withChecks") {
      const checks = g.checks
        .map((c) => `${c.label}:${s.checks?.[c.key] ? "OK" : "MISS"}`)
        .join(", ");
      return `${base} | ${checks}`;
    }
    return base;
  }).join("\n");

  const kpiLine = `완료율 ${kpis.completionRate || "_"}% / D1재방문 ${kpis.d1ReturnRate || "_"}% / helpful 평균 ${kpis.helpfulAvg || "_"}`;
  const aiVerdict = aiJson?.overall_verdict;
  const finalVerdict = overrideVerdict || aiVerdict || computeGateVerdict(gateState).overall;

  const insightBlock = aiJson
    ? [
        `판정 이유: ${aiJson.verdict_reason || "-"}`,
        `KPI 인사이트: ${aiJson.kpi_insight || "-"}`,
        `핵심 이슈: ${(aiJson.critical_issues || []).slice(0, 3).join(" / ") || "-"}`,
        `루미 추천: ${aiJson.lumi_recommendation || "-"}`,
      ].join("\n")
    : "(AI 인사이트 미생성 — Gate/KPI 기반으로 수동 보고서 초안을 생성했습니다.)";

  return [
    `배포 URL: ${deployUrl || "_"}`,
    `\nRelease Gate 1~11 통과 여부: ${finalVerdict === "LAUNCH_OK" ? "✅ 통과" : "🔴 보류"}`,
    `\n[Gate 상세]`,
    gateLines,
    `\n[KPI]`,
    kpiLine,
    `\n[에러 TOP3]`,
    (errorTop3 || []).filter(Boolean).length
      ? errorTop3.filter(Boolean).slice(0, 3).map((x, i) => `${i + 1}) ${x}`).join("\n")
      : "_",
    `\n[발견 이슈 메모]`,
    issueNotes?.trim() ? issueNotes.trim() : "_",
    `\n[루미 인사이트]`,
    insightBlock,
  ].join("\n");
}

function safeParseJson(text) {
  if (!text) return { ok: false, value: null, error: "empty" };
  try {
    const v = JSON.parse(text);
    return { ok: true, value: v, error: null };
  } catch (e) {
    return { ok: false, value: null, error: e?.message || "parse error" };
  }
}

export default function LumiSoftLaunchGateArtifact() {
  const [gateState, setGateState] = useState(() => initialGateState());
  const [deployUrl, setDeployUrl] = useState("");
  const [completionRate, setCompletionRate] = useState("");
  const [d1ReturnRate, setD1ReturnRate] = useState("");
  const [helpfulAvg, setHelpfulAvg] = useState("");
  const [errorTop3, setErrorTop3] = useState(["", "", ""]);
  const [issueNotes, setIssueNotes] = useState("");

  // API Config — proxy mode: apiKey/apiBaseUrl are no longer used
  const [model, setModel] = useState("claude-sonnet-4-20250514");
  const [maxTokens, setMaxTokens] = useState(1000);

  const [isLoading, setIsLoading] = useState(false);
  const [aiRaw, setAiRaw] = useState("");
  const [aiJson, setAiJson] = useState(null);
  const [aiError, setAiError] = useState("");

  const verdict = useMemo(() => computeGateVerdict(gateState), [gateState]);
  const kpi = useMemo(
    () => ({ completionRate, d1ReturnRate, helpfulAvg }),
    [completionRate, d1ReturnRate, helpfulAvg]
  );
  const kpiEval = useMemo(() => kpiStatus(kpi), [kpi]);

  const overallVerdict = useMemo(() => {
    if (verdict.overall === "LAUNCH_HOLD") return "LAUNCH_HOLD";
    if (kpiEval.provided && kpiEval.okCount < 3) return "LAUNCH_HOLD";
    return "LAUNCH_OK";
  }, [verdict.overall, kpiEval.provided, kpiEval.okCount]);

  const banner = useMemo(() => {
    const ok = overallVerdict === "LAUNCH_OK";
    return {
      ok,
      title: ok ? "🟢 LAUNCH OK" : "🔴 LAUNCH HOLD",
      sub: ok
        ? "Gate/지표 기준을 충족했습니다. Soft Launch 진행 가능합니다."
        : "FAIL(예외 미승인) 또는 KPI 미달이 있습니다. 배포/확대 전 보완 권장.",
    };
  }, [overallVerdict]);

  const ceoReport = useMemo(
    () =>
      buildRunbookStyleReport({
        deployUrl,
        gateState,
        kpis: kpi,
        errorTop3,
        issueNotes,
        aiJson,
        overrideVerdict: overallVerdict,
      }),
    [deployUrl, gateState, kpi, errorTop3, issueNotes, aiJson, overallVerdict]
  );

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  function updateGate(id, patch) {
    setGateState((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  function updateGateCheck(id, key, value) {
    setGateState((prev) => ({
      ...prev,
      [id]: { ...prev[id], checks: { ...(prev[id].checks || {}), [key]: value } },
    }));
  }

  function buildClaudePayload() {
    const gatePayload = DEFAULT_GATES.map((g) => {
      const s = gateState[g.id];
      const base = {
        gate_id: g.id,
        title: g.title,
        pass: Boolean(s.pass),
        exception_approved: Boolean(s.exceptionApproved),
      };
      if (g.kind === "withNumber") return { ...base, anon_user_id_null_count: Number(s.numberValue) };
      if (g.kind === "withChecks") return { ...base, checks: s.checks || {} };
      return base;
    });

    return {
      deploy_url: deployUrl,
      gates: gatePayload,
      kpis: {
        completion_rate_pct: Number(completionRate),
        d1_return_rate_pct: Number(d1ReturnRate),
        helpful_avg: Number(helpfulAvg),
        targets: KPI_TARGETS,
      },
      error_top3: errorTop3,
      issue_notes: issueNotes,
      computed_verdict: overallVerdict,
    };
  }

  async function runLumiAnalysis() {
    setIsLoading(true);
    setAiError("");
    setAiRaw("");
    setAiJson(null);

    const systemPrompt = `당신은 하루하루의 기적 플랫폼의 데이터 분석가 루미입니다.
Soft Launch Gate 검증 결과를 분석하고 CEO 보고서를 작성합니다.

규칙:
- 데이터 기반, 간결, 핵심만
- 루미 어조: 분석적·신뢰감·따뜻함 균형
- 운세/타로/점 단어 절대 금지
- 한국어로만

반드시 아래 JSON 형식으로만 응답 (마크다운 없이):
{
  "overall_verdict": "LAUNCH_OK" | "LAUNCH_HOLD",
  "verdict_reason": "판정 이유 1문장",
  "kpi_insight": "KPI 3개 종합 인사이트 2문장",
  "critical_issues": ["주요 이슈 1", "주요 이슈 2"],
  "lumi_recommendation": "루미 최종 추천 액션 2문장",
  "ceo_report_draft": "CEO 보고서 초안 (배포URL / Gate 1~11 / KPI / 에러TOP3 형식 완성본)"
}`;

    const userPayload = buildClaudePayload();

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: Number(maxTokens) || 1000,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: `다음 Soft Launch Gate 결과를 분석해 주세요.\n\n입력(JSON):\n${JSON.stringify(userPayload)}`,
            },
          ],
        }),
      });

      const text = await res.text();
      setAiRaw(text);

      if (!res.ok) throw new Error(`API 오류 (${res.status}): ${text.slice(0, 300)}`);

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error("API 응답 JSON 파싱 실패");
      }

      const assistantText =
        parsed?.content?.map((c) => (typeof c?.text === "string" ? c.text : "")).join("") ||
        parsed?.content?.[0]?.text ||
        "";

      const { ok, value, error } = safeParseJson((assistantText || "").trim());
      if (!ok) throw new Error(`AI JSON 파싱 실패: ${error}`);

      setAiJson(value);
    } catch (e) {
      setAiError(e?.message || "분석 실패");
    } finally {
      setIsLoading(false);
    }
  }

  function resetAll() {
    setGateState(initialGateState());
    setDeployUrl("");
    setCompletionRate("");
    setD1ReturnRate("");
    setHelpfulAvg("");
    setErrorTop3(["", "", ""]);
    setIssueNotes("");
    setAiRaw("");
    setAiJson(null);
    setAiError("");
    setModel("claude-sonnet-4-20250514");
    setMaxTokens(1000);
  }

  const completionBadge = pctBadge(completionRate, KPI_TARGETS.completionRate);
  const d1Badge = pctBadge(d1ReturnRate, KPI_TARGETS.d1ReturnRate);
  const helpfulBadge = numBadge(helpfulAvg, KPI_TARGETS.helpfulAvg);

  return (
    <div className="min-h-screen bg-[#071a13] text-white">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 520ms ease-in-out; }
      `}</style>

      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#071a13]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-baseline gap-3">
            <div className="font-mono text-sm text-white/70">AIL-2026-LUMI-ARTIFACT-001</div>
            <h1 className="text-lg font-semibold tracking-tight">Soft Launch Gate Judge & CEO Report</h1>
          </div>
          <button
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            onClick={resetAll}
          >
            Reset
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-2">
        {/* Left: Inputs */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Gate 입력 패널</h2>
            <div className="text-xs text-white/60">Pass/Fail + 예외 승인(FAIL 항목)</div>
          </div>

          {/* Deploy URL */}
          <div className="mb-4">
            <label className="mb-1 block text-xs text-white/70">배포 URL</label>
            <input
              value={deployUrl}
              onChange={(e) => setDeployUrl(e.target.value)}
              placeholder="https://서비스URL"
              className="w-full rounded-xl border border-white/10 bg-[#0D2B1F] px-3 py-2 font-mono text-sm outline-none focus:border-[#A8FF3E]/60"
            />
          </div>

          {/* Gates */}
          <div className="space-y-3">
            {DEFAULT_GATES.map((g) => {
              const s = gateState[g.id];
              const checksAllOk =
                g.kind !== "withChecks" || Object.values(s.checks || {}).every(Boolean);
              const gate4Ok = g.id !== 4 || Number(s.numberValue) === 0;
              const isFail = !s.pass || !checksAllOk || !gate4Ok;
              const needsShake = isFail && !s.exceptionApproved;

              return (
                <div
                  key={g.id}
                  className={classNames(
                    "rounded-2xl border border-white/10 bg-[#0D2B1F]/70 p-3",
                    needsShake ? "animate-shake" : ""
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-xs text-white/60">Gate #{g.id}</div>
                        <div className="text-sm font-semibold">{g.title}</div>
                      </div>
                      <div className="mt-1 text-xs text-white/55">
                        {g.id === 4
                          ? "PASS 조건: landing_view 기록 + anon_user_id NULL 건수 0"
                          : g.id === 11
                          ? "PASS 조건: requestId / error_class / route 모두 포함"
                          : ""}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateGate(g.id, { pass: true, exceptionApproved: false })}
                        className={classNames(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          s.pass
                            ? "bg-[#A8FF3E] text-black"
                            : "bg-white/10 text-white/80 hover:bg-white/15"
                        )}
                      >
                        PASS
                      </button>
                      <button
                        onClick={() => updateGate(g.id, { pass: false })}
                        className={classNames(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          !s.pass
                            ? "bg-red-500 text-white"
                            : "bg-white/10 text-white/80 hover:bg-white/15"
                        )}
                      >
                        FAIL
                      </button>
                    </div>
                  </div>

                  {!s.pass && (
                    <div className="mt-2 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                      <div>
                        <div className="text-xs font-semibold text-white/80">예외 승인 가능</div>
                        <div className="text-[11px] text-white/55">
                          (FAIL이지만 CEO/코미 판단으로 진행 허용)
                        </div>
                      </div>
                      <label className="inline-flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-[#A8FF3E]"
                          checked={Boolean(s.exceptionApproved)}
                          onChange={(e) =>
                            updateGate(g.id, { exceptionApproved: e.target.checked })
                          }
                        />
                        <span className="text-xs text-white/70">승인</span>
                      </label>
                    </div>
                  )}

                  {g.kind === "withNumber" && (
                    <div className="mt-2">
                      <label className="mb-1 block text-xs text-white/70">{g.numberLabel}</label>
                      <input
                        value={s.numberValue}
                        onChange={(e) =>
                          updateGate(g.id, {
                            numberValue: clampNumber(e.target.value, { min: 0, max: 999999 }),
                          })
                        }
                        placeholder="0"
                        className={classNames(
                          "w-full rounded-xl border bg-[#071a13] px-3 py-2 font-mono text-sm outline-none",
                          Number(s.numberValue) === 0
                            ? "border-white/10 focus:border-[#A8FF3E]/60"
                            : "border-red-500/60 focus:border-red-400"
                        )}
                      />
                      <div className="mt-1 text-[11px] text-white/55">{g.numberHint}</div>
                    </div>
                  )}

                  {g.kind === "withChecks" && (
                    <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                      {g.checks.map((c) => (
                        <label
                          key={c.key}
                          className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
                        >
                          <span className="font-mono text-xs text-white/80">{c.label}</span>
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#A8FF3E]"
                            checked={Boolean(s.checks?.[c.key])}
                            onChange={(e) => updateGateCheck(g.id, c.key, e.target.checked)}
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* KPI */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0D2B1F]/70 p-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">KPI 수치 입력</h3>
              <div className="text-[11px] text-white/60">목표: 완료율≥60 / D1≥25 / helpful≥4.0</div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-white/70">진단 완료율 (%)</label>
                <input
                  value={completionRate}
                  onChange={(e) =>
                    setCompletionRate(clampNumber(e.target.value, { min: 0, max: 100 }))
                  }
                  placeholder="예: 62.3"
                  className={classNames(
                    "w-full rounded-xl border bg-[#071a13] px-3 py-2 font-mono text-sm outline-none",
                    completionBadge.ok === null
                      ? "border-white/10 focus:border-[#A8FF3E]/60"
                      : completionBadge.ok
                      ? "border-[#A8FF3E]/60"
                      : "border-red-500/60"
                  )}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/70">D1 재방문율 (%)</label>
                <input
                  value={d1ReturnRate}
                  onChange={(e) =>
                    setD1ReturnRate(clampNumber(e.target.value, { min: 0, max: 100 }))
                  }
                  placeholder="예: 27.0"
                  className={classNames(
                    "w-full rounded-xl border bg-[#071a13] px-3 py-2 font-mono text-sm outline-none",
                    d1Badge.ok === null
                      ? "border-white/10 focus:border-[#A8FF3E]/60"
                      : d1Badge.ok
                      ? "border-[#A8FF3E]/60"
                      : "border-red-500/60"
                  )}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/70">helpful 평균</label>
                <input
                  value={helpfulAvg}
                  onChange={(e) =>
                    setHelpfulAvg(clampNumber(e.target.value, { min: 0, max: 5 }))
                  }
                  placeholder="예: 4.12"
                  className={classNames(
                    "w-full rounded-xl border bg-[#071a13] px-3 py-2 font-mono text-sm outline-none",
                    helpfulBadge.ok === null
                      ? "border-white/10 focus:border-[#A8FF3E]/60"
                      : helpfulBadge.ok
                      ? "border-[#A8FF3E]/60"
                      : "border-red-500/60"
                  )}
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
              <KpiChip label="완료율" badge={completionBadge} target={`${KPI_TARGETS.completionRate}%+`} />
              <KpiChip label="D1" badge={d1Badge} target={`${KPI_TARGETS.d1ReturnRate}%+`} />
              <KpiChip label="helpful" badge={helpfulBadge} target={`${KPI_TARGETS.helpfulAvg}+`} />
            </div>
          </div>

          {/* Error TOP3 */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0D2B1F]/70 p-3">
            <h3 className="text-sm font-semibold">에러 TOP3</h3>
            <div className="mt-2 space-y-2">
              {errorTop3.map((v, idx) => (
                <input
                  key={idx}
                  value={v}
                  onChange={(e) => {
                    const nv = [...errorTop3];
                    nv[idx] = e.target.value;
                    setErrorTop3(nv);
                  }}
                  placeholder={`${idx + 1}) 예: DB connection timeout / VALIDATION spike / route /api/...`}
                  className="w-full rounded-xl border border-white/10 bg-[#071a13] px-3 py-2 font-mono text-sm outline-none focus:border-[#A8FF3E]/60"
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0D2B1F]/70 p-3">
            <h3 className="text-sm font-semibold">발견 이슈 메모</h3>
            <textarea
              value={issueNotes}
              onChange={(e) => setIssueNotes(e.target.value)}
              placeholder="관찰된 문제/재현 조건/임시 대응 등을 적어주세요."
              className="mt-2 h-28 w-full resize-none rounded-xl border border-white/10 bg-[#071a13] px-3 py-2 font-mono text-sm outline-none focus:border-[#A8FF3E]/60"
            />
          </div>

          {/* API Config — Proxy Mode */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0D2B1F]/70 p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Claude API 설정</h3>
              {/* Proxy Mode 표시 배너 */}
              <div className="flex items-center gap-1.5 rounded-full border border-[#A8FF3E]/40 bg-[#A8FF3E]/10 px-3 py-1 text-xs font-semibold text-[#A8FF3E]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A8FF3E]" />
                Proxy Mode: ON
              </div>
            </div>

            <div className="mt-2 rounded-xl border border-[#A8FF3E]/20 bg-[#A8FF3E]/5 px-3 py-2 text-xs text-[#A8FF3E]/80">
              AI requests handled by server — /api/ai
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-white/70">Model</label>
                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#071a13] px-3 py-2 font-mono text-sm outline-none focus:border-[#A8FF3E]/60"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/70">max_tokens</label>
                <input
                  value={String(maxTokens)}
                  onChange={(e) =>
                    setMaxTokens(
                      Number(clampNumber(e.target.value, { min: 1, max: 4000 })) || 1000
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#071a13] px-3 py-2 font-mono text-sm outline-none focus:border-[#A8FF3E]/60"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-white/70">API Key</label>
                <input
                  disabled
                  placeholder="Server Proxy Mode Enabled"
                  className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-[#071a13] px-3 py-2 font-mono text-sm text-white/40 opacity-50 outline-none"
                />
                <div className="mt-1 text-[11px] text-white/55">
                  API Key는 서버 환경변수(ANTHROPIC_API_KEY)에서만 사용됩니다.
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={runLumiAnalysis}
                disabled={isLoading}
                className={classNames(
                  "rounded-xl bg-[#A8FF3E] px-4 py-2 text-sm font-semibold text-black",
                  isLoading ? "opacity-70" : "hover:brightness-95"
                )}
              >
                {isLoading ? "분석 중…" : "루미 분석 시작 →"}
              </button>
              <button
                onClick={() => {
                  setAiError("");
                  setAiRaw("");
                  setAiJson(null);
                }}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                AI 결과 초기화
              </button>
            </div>

            {aiError && (
              <div className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm">
                <div className="font-semibold">분석 실패</div>
                <div className="mt-1 whitespace-pre-wrap text-white/80">{aiError}</div>
                <div className="mt-2 text-[11px] text-white/60">
                  안내: 네트워크/키/프록시 설정 문제일 수 있습니다. 이 경우 우측 "CEO 보고서 초안"은 계속 자동 생성됩니다.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right: Results */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow">
          <div
            className={classNames(
              "rounded-2xl border p-4",
              banner.ok ? "border-[#A8FF3E]/40 bg-[#0D2B1F]" : "border-red-500/40 bg-[#1a0a0a]",
              banner.ok ? "animate-pulse" : ""
            )}
          >
            <div className="text-2xl font-bold">{banner.title}</div>
            <div className="mt-1 text-sm text-white/80">{banner.sub}</div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <MiniPill
                label="Gate FAIL"
                value={`${verdict.failList.length}`}
                tone={verdict.failList.length === 0 ? "ok" : "warn"}
              />
              <MiniPill
                label="KPI OK"
                value={`${kpiEval.okCount}/3`}
                tone={kpiEval.okCount === 3 ? "ok" : "warn"}
              />
              <MiniPill
                label="예외 승인"
                value={`${Object.values(gateState).filter((x) => x.exceptionApproved).length}`}
                tone="neutral"
              />
            </div>
          </div>

          {/* AI Insight */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0D2B1F]/70 p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">루미 인사이트 (AI 생성)</h3>
              <div className="text-[11px] text-white/60">JSON 파싱 성공 시 자동 렌더</div>
            </div>

            {aiJson ? (
              <div className="mt-2 space-y-2 text-sm">
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-xs text-white/60">overall_verdict</div>
                  <div className="mt-1 font-mono text-[#A8FF3E]">{aiJson.overall_verdict}</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-xs text-white/60">verdict_reason</div>
                  <div className="mt-1 text-white/90">{aiJson.verdict_reason}</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-xs text-white/60">kpi_insight</div>
                  <div className="mt-1 text-white/90">{aiJson.kpi_insight}</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-xs text-white/60">critical_issues</div>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-white/90">
                    {(aiJson.critical_issues || []).slice(0, 5).map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-xs text-white/60">lumi_recommendation</div>
                  <div className="mt-1 text-white/90">{aiJson.lumi_recommendation}</div>
                </div>
              </div>
            ) : (
              <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                AI 인사이트가 아직 없습니다. 좌측에서 "루미 분석 시작"을 누르거나, AI 없이도 우측 보고서 초안을 사용하세요.
              </div>
            )}

            {aiRaw && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-white/60">원문 응답(raw) 보기</summary>
                <pre className="mt-2 max-h-56 overflow-auto rounded-xl border border-white/10 bg-[#071a13] p-3 text-[11px] text-white/80">
{aiRaw}
                </pre>
              </details>
            )}
          </div>

          {/* CEO Report */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0D2B1F]/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">CEO 보고서 초안</h3>
              <button
                onClick={async () => {
                  const ok = await copyToClipboard(
                    aiJson?.ceo_report_draft ? aiJson.ceo_report_draft : ceoReport
                  );
                  if (!ok) alert("복사 실패: 브라우저 권한을 확인해주세요.");
                }}
                className="rounded-xl bg-white/10 px-3 py-2 text-xs hover:bg-white/15"
              >
                복사하기
              </button>
            </div>

            <textarea
              value={aiJson?.ceo_report_draft ? aiJson.ceo_report_draft : ceoReport}
              readOnly
              className="mt-2 h-[420px] w-full resize-none rounded-xl border border-white/10 bg-[#071a13] p-3 font-mono text-[12px] leading-relaxed text-white/90 outline-none"
            />

            <div className="mt-2 text-[11px] text-white/60">
              * AI 생성 보고서가 없으면, Gate/KPI 기반 수동 초안을 자동 생성합니다.
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-2 text-[11px] text-white/50">
        <div>
          SSOT: AIL-2026-MVO-OPEN-002 FINAL v1.0.2 기반. localStorage 금지(state only). 금지 단어(운세/타로/점) 사용 금지.
        </div>
      </footer>
    </div>
  );
}

function MiniPill({ label, value, tone }) {
  const toneCls =
    tone === "ok"
      ? "border-[#A8FF3E]/40 bg-[#A8FF3E]/15 text-[#A8FF3E]"
      : tone === "warn"
      ? "border-red-500/40 bg-red-500/10 text-red-200"
      : "border-white/15 bg-white/5 text-white/80";

  return (
    <div className={classNames("rounded-full border px-3 py-1 font-mono", toneCls)}>
      <span className="text-white/70">{label}</span>
      <span className="mx-2 text-white/30">|</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function KpiChip({ label, badge, target }) {
  const cls =
    badge.ok === null
      ? "border-white/15 bg-white/5"
      : badge.ok
      ? "border-[#A8FF3E]/40 bg-[#A8FF3E]/10"
      : "border-red-500/40 bg-red-500/10";

  const valCls =
    badge.ok === null ? "text-white/70" : badge.ok ? "text-[#A8FF3E]" : "text-red-200";

  return (
    <div className={classNames("rounded-xl border px-3 py-2", cls)}>
      <div className="flex items-center justify-between">
        <div className="text-xs text-white/70">{label}</div>
        <div className="text-[11px] text-white/50">target {target}</div>
      </div>
      <div className={classNames("mt-1 font-mono text-sm font-semibold", valCls)}>{badge.label}</div>
    </div>
  );
}
