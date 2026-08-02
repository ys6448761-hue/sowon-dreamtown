/**
 * CHECKIN-002: 체크인 분석 이벤트 로거 (서버 전용)
 *
 * 개인정보 원문(이름, 사진 URL, 전화번호)은 로그에 포함하지 않는다.
 * starId, sessionId, 이벤트 유형, 타임스탬프만 기록한다.
 */

type CheckinEvent =
  | "checkin_qr_opened"
  | "citizen_registration_completed"
  | "portrait_uploaded"
  | "wish_submitted"
  | "star_created"
  | "wish_image_generation_started"
  | "wish_image_generation_completed"
  | "checkin_completed"
  | "checkin_resumed";

interface CheckinEventPayload {
  event: CheckinEvent;
  starId?: string;
  requestId?: string;
  errorCode?: string;
  browser?: string;
  device?: string;
}

export function logCheckinEvent(payload: CheckinEventPayload): void {
  console.log(
    JSON.stringify({
      source: "checkin",
      ts: new Date().toISOString(),
      ...payload,
    })
  );
}
