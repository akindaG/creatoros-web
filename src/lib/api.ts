export const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export function getToken(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem("creatoros_token") ?? "";
  } catch {
    return "";
  }
}

function responseMessage(body: unknown, status: number): string {
  if (typeof body === "string" && body.trim()) return body;
  if (!body || typeof body !== "object") return `Request failed (${status})`;

  const record = body as { detail?: unknown; message?: unknown };
  const detail = record.detail ?? record.message;
  if (typeof detail === "string" && detail.trim()) return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (!item || typeof item !== "object") return "";
        const issue = item as { loc?: unknown; msg?: unknown };
        const field = Array.isArray(issue.loc) ? issue.loc.at(-1) : undefined;
        return typeof issue.msg === "string"
          ? `${typeof field === "string" ? `${field}: ` : ""}${issue.msg}`
          : "";
      })
      .filter(Boolean);
    if (messages.length) return messages.join("; ");
  }
  return `Request failed (${status})`;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (init.body != null && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new Error("Could not reach the CreatorOS API. Check that the backend is running and try again.");
  }

  const text = response.status === 204 ? "" : await response.text();
  let body: unknown;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    throw new Error(responseMessage(body, response.status));
  }
  return body as T;
}
