"use client";

import { useSession } from "@/context/SessionContext";



export default function RegisterUser() {
    const { isLoggedIn, checking, refreshSession } = useSession();

    // Show loader while checking session (no form flash)
  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-[#0F6466] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-700 font-medium text-lg">
          Loading, Please wait...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 overflow-hidden flex flex-col justify-center">
        <div id="card" className="formDiv formUser flex-grow flex flex-col items-center mx-auto justify-center mb-16 ">
            <h1 className="page-title-center text-xl font-semibold">
            Registration
            </h1>
            <p>Please contact with Manager</p>
        </div>
        </div>
  )
};