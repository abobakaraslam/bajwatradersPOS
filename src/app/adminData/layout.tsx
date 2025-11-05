// src/app/adminData/layout.tsx
"use client";

import { SessionProvider } from "@/context/SessionContext";
import HeaderPOSAdmin from "./HeaderPOSAdmin/page";
import FooterAdmin from "./FooterAdmin/page";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="containerUser2 min-h-screen ">
        <HeaderPOSAdmin />
        <main className="p-6">{children}</main>
        <FooterAdmin />
      </div>
    </SessionProvider>
  );
}

