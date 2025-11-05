"use client";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useState } from "react";

export default function HeaderPOSUser() {
  const router = useRouter();
  const { isLoggedIn, checking, refreshSession } = useSession();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (data.status === "OK") {
        await refreshSession();
        router.push("/userData/LoginUser");
      }
    }catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="no-print">
      <div
        className="flex flex-col sm:flex-row sm:justify-between items-center
        p-4 gap-4 sm:gap-0"
      >
        {/* Left Side — Logo and Title */}
        <div
          className="cursor-pointer flex"
          onClick={() => router.push("/userData/ProfileUser")}
        >
          <div className="flex">
            <img
              src="/logoPOS.svg"
              width="25"
              height="25"
              alt="Logo"
              className="m-0 mr-3 p-0"
            />
          </div>
          <div>
            <p className="font-medium text-lg leading-none">Point of Sale</p>
            <p className="text-sm ml-[37px] text-right">Salesman</p>
          </div>
        </div>

        {/* Right Side — Buttons or Skeleton */}
        <div>
          {checking ? (
            // Skeleton placeholders (while API checking session)
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-8 w-20 rounded"></div>
              <div className="h-8 w-20 rounded"></div>
            </div>
          ) : isLoggedIn ? (
            // Logout Button
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            // Login + Register Buttons
            <>
              <button
                onClick={() => router.push("/userData/LoginUser")}
                className="px-4 py-2 rounded mr-3"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/userData/RegisterUser")}
                className="text-white px-4 py-2 rounded"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Below header title */}
      <h1 className="page-title-center p-0">Bajwa Traders</h1>
    </div>
  );
}
