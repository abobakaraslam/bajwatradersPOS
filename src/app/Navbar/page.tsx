"use client";

import Link from "next/link";

export default function Navbar() {

  return (
    <nav className="flex justify-between">
      <div>
        <Link href="/" className="hover:bg-[#0F6466] hover:text-white">Home</Link>
      </div>
      <div>
        <Link href="/userData/ProfileUser" className="hover:bg-[#0F6466] hover:text-white">Salesman</Link>
        <Link href="/adminData/ProfileAdmin" className="hover:bg-[#0F6466] hover:text-white">Manager</Link>
      </div>
    </nav>
  );
}
