"use client";

import { SessionProvider } from "@/context/SessionContext";
import HeaderPOSUser from "./HeaderPOSUser/page";
import FooterUser from "./FooterUser/page";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="containerUser1 min-h-screen">
        <HeaderPOSUser />
        <main className="p-6">{children}</main>
        <FooterUser />
      </div>
    </SessionProvider>
  );
}

