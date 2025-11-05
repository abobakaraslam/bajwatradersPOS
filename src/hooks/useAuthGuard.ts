"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Custom hook to protect pages that require authentication.
 * Redirects to /userData/LoginUser if token is missing or invalid.
 */
export function useAuthGuard(redirectUrl: string = "/userData/LoginUser") {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token → immediate redirect
    if (!token) {
      router.replace("/userData/LoginUser");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // Invalid or expired token
          localStorage.removeItem("token");
          router.replace("/userData/LoginUser");
          return;
        }

        const data = await res.json();
        setUser(data.user);
        setIsVerified(true);
      } catch (err) {
        console.error("Auth verification failed:", err);
        localStorage.removeItem("token");
        router.replace("/userData/LoginUser");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  return { isVerified, loading, user };
}
