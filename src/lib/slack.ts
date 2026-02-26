/**
 * Slack 웹훅 알람 전송 유틸리티
 *
 * 환경변수: SLACK_WEBHOOK_URL
 * 쿨다운: 동일 타입 알람은 30분 내 중복 전송 안 함
 */

type Alert = { type: string; severity: "red" | "yellow"; message: string };

const COOLDOWN_MS = 30 * 60 * 1000; // 30분
const lastSent = new Map<string, number>();

function isInCooldown(type: string): boolean {
  const ts = lastSent.get(type);
  if (!ts) return false;
  return Date.now() - ts < COOLDOWN_MS;
}

function markSent(type: string): void {
  lastSent.set(type, Date.now());
}

const SEVERITY_EMOJI: Record<string, string> = {
  red: "\u{1F534}",    // 🔴
  yellow: "\u{1F7E1}", // 🟡
};

export async function sendSlackAlerts(alerts: Alert[]): Promise<number> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return 0;

  const toSend = alerts.filter((a) => !isInCooldown(a.type));
  if (toSend.length === 0) return 0;

  const lines = toSend.map(
    (a) => `${SEVERITY_EMOJI[a.severity] ?? "\u26A0\uFE0F"} *[${a.type}]* ${a.message}`,
  );

  const text = `*소원꿈터 운영 알람*\n${lines.join("\n")}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      for (const a of toSend) markSent(a.type);
      return toSend.length;
    }

    console.error("[slack] webhook failed:", res.status, await res.text().catch(() => ""));
    return 0;
  } catch (e) {
    console.error("[slack] webhook error:", e);
    return 0;
  }
}
