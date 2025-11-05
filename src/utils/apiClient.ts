// src/utils/apiClient.ts
"use client";

export async function apiClient(
  url: string,
  options: RequestInit = {},
  redirectPath: string = "/userData/LoginUser"
): Promise<Response> {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;

  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    // Network-level failure (server down, CORS, offline, etc.)
    throw { type: "network", message: "Unable to connect to server." };
  }

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = redirectPath;
    throw { type: "unauthorized", message: "Session expired. Redirecting…" };
  }

  if (!response.ok) {
    // Try to extract message from backend
    let errorMsg = "Unexpected server error.";
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch {}
    throw { type: "api", status: response.status, message: errorMsg };
  }

  return response;
}
