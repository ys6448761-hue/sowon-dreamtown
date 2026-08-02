/**
 * /checkin — QR 체크인 (CHECKIN-001 / CHECKIN-002) + Soft Open Resume
 *
 * Server Component: CheckinPageContent(Client)를 Suspense로 감싸
 * useSearchParams() SSR 오류를 방지한다.
 *
 * Phase A (Soft Open): 정적 이미지만 공개, WishArt 생성 없음
 */

import { Suspense } from "react";
import CheckinPageContent from "./CheckinPageContent";

export default function CheckinPage() {
  return (
    <Suspense>
      <CheckinPageContent />
    </Suspense>
  );
}
