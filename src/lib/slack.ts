/**
 * Slack 웹훅 알람 전송 유틸리티
 *
 * 정책:
 * - RED / STALE_PENDING → 즉시 전송 (쿨다운 30분)
 * - YELLOW → 전송하지 않음 (하루 1회 요약용으로만 사용)
 * - 중복 억제 키: `${type}-${range}` (동일 키 30분/6시간 내 재전송 차단)
 *
 * 환경변수: SLACK_WEBHOOK_URL (미설정 시 전송 생략)
 */

type Alert = { type: string; severity: "red" | "yellow"; message: string };

const COOLDOWN: Record<string, number> = {
  red: 30 * 60 * 1000,    // 30분
  yellow: 6 * 60 * 60 * 1000, // 6시간
};

const lastSent = new Map<string, number>();

function cooldownKey(alert: Alert, range: string): string {
  return `${alert.type}-${range}`;
}

function isInCooldown(key: string, severity: string): boolean {
  const ts = lastSent.get(key);
  if (!ts) return false;
  const cd = COOLDOWN[severity] ?? COOLDOWN.red;
  return Date.now() - ts < cd;
}

function markSent(key: string): void {
  lastSent.set(key, Date.now());
}

/** 즉시 전송 대상인지 판별 */
function shouldSendNow(alert: Alert): boolean {
  return alert.severity === "red" || alert.type === "STALE_PENDING";
}

/**
 * 즉시 전송 대상 알람만 Slack 웹훅으로 전송한다.
 * YELLOW는 건너뛴다 (하루 1회 요약 전용).
 *
 * @returns 실제 전송된 알람 수
 */
export async function sendSlackAlerts(
  alerts: Alert[],
  range: string,
): Promise<number> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return 0;

  const toSend = alerts.filter((a) => {
    if (!shouldSendNow(a)) return false;
    const key = cooldownKey(a, range);
    return !isInCooldown(key, a.severity);
  });

  if (toSend.length === 0) return 0;

  const lines = toSend.map(
    (a) => `\u{1F6A8} *${a.type}*\n${a.message}\nrange: ${range}`,
  );

  const text = lines.join("\n\n");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      for (const a of toSend) markSent(cooldownKey(a, range));
      return toSend.length;
    }

    console.error("[slack] webhook failed:", res.status, await res.text().catch(() => ""));
    return 0;
  } catch (e) {
    console.error("[slack] webhook error:", e);
    return 0;
  }
}
