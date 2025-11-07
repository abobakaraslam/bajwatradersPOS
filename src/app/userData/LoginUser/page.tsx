/*File: page.jsx located in app/userData/LoginUser/     */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingLogin, setloadingLogin] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const router = useRouter();
  const { isLoggedIn, checking, refreshSession } = useSession();

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
      const response = await fetch("/api/userData/login_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
        credentials: "include", // ensures cookies are stored/sent
      });

      const data = await response.json();

      if (data.success === "OK") {
        await refreshSession();
        console.log("successfully logged in");
        router.push("/userData/ProfileUser");
      } else {
        setError(data.message || "Invalid email or password");
        setButtonDisable(false);
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
      setButtonDisable(false);
    } finally {
      setloadingLogin(false);
    }
  };

  // Show loader while checking session (no form flash)
  if (checking) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center">
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
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <div>
              <label htmlFor="email" className="formLabel">
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

            {/* Login Button with Spinner */}
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
