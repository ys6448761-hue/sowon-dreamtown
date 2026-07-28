"use client";

import { SessionProvider } from "next-auth/react";
import ClaimModal from "./dreamtown/ClaimModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ClaimModal />
    </SessionProvider>
  );
}