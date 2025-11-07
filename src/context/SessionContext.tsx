// File: SessionContext.tsx located in src/context/SessionContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface SessionContextType {
  isLoggedIn: boolean;
  checking: boolean;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  isLoggedIn: false,
  checking: true,
  refreshSession: async () => {},
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  const refreshSession = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/auth/validate-session", {
        credentials: "include" // ensures cookies are stored/sent
      });
      const data = await res.json();
      setIsLoggedIn(data.valid);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <SessionContext.Provider value={{ isLoggedIn, checking, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
