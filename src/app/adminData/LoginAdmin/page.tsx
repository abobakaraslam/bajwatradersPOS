/*File: page.jsx located in app/adminData/LoginAdmin/     */

"use client";

import {useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingLogin, setloadingLogin] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const { isLoggedIn, checking, refreshSession } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Both email and password are required!");
      return;
    }

    setloadingLogin(true);
    setButtonDisable(true);
    setError("");

    try {
      const response = await fetch("../../api/adminData/login_admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
        }),
        credentials: "include", // ensures cookies are stored/sent
      });

      const data = await response.json();
      //console.log("data: ", data)

      if (data.success === "OK") {
        await refreshSession();
        console.log("successfully logged in");
        router.push("/adminData/ProfileAdmin");
      } else {
        setButtonDisable(false);
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      setButtonDisable(false);
      setError("An error occurred during login. Please try again.");
    } finally {
      setloadingLogin(false);
    }
  };

  // While checking auth, show only loader
  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-10 h-10 rounded-full border-[4px] border-solid spinColor animate-spin"></div>
        <p className="mt-3 text-gray-700 font-medium text-lg">
          Loading, Please wait...
        </p>
      </div>
    );
  }

  // Show login form only if not authenticated
  return (
    <div className="m-0 p-0">
      <div className="screenMiddleDivHorizontal">
        <div className="formDiv">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-center">Login</h2>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div>
              <label htmlFor="email" className="formLabel block mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="my-6">
              <label htmlFor="password" className="formLabel">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="formButton flex items-center justify-center gap-2 disabled:opacity-70"
              disabled={buttonDisable}
            >
              {loadingLogin ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
