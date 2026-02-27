import { createClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();

  let { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
    session = refreshedSession;
  }

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API error: ${response.status}`);
  }

  return response.json();
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API error: ${response.status}`);
  }

  return response.json();
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API error: ${response.status}`);
  }

  return response.json();
}

export async function apiDelete(path: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok && response.status !== 204) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API error: ${response.status}`);
  }
}

// API Types
export interface UserProfile {
  id: string;
  email: string;
  subscription_status: string | null;
}

// Helpers
function toQuery(params?: Record<string, string | undefined>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string] => entry[1] !== undefined,
  );
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries).toString();
}

// API Functions
export const api = {
  getMe: () => apiGet<UserProfile>("/api/v1/users/me"),
  hello: () => apiGet<{ message: string }>("/api/v1/hello"),
  createCheckout: () => apiPost<{ checkout_url: string }>("/api/v1/checkout"),
};

// Voice Agent API
import type { VoiceAgentAnalytics, VoiceAgentConfig, Call } from "@/lib/mock-data";

export const voiceAgentApi = {
  getAnalytics: () =>
    apiGet<VoiceAgentAnalytics>("/api/v1/voice-agent/analytics"),
  getCalls: (params?: { date?: string; outcome?: string; search?: string }) =>
    apiGet<Call[]>(`/api/v1/voice-agent/calls${toQuery(params)}`),
  getConfig: () =>
    apiGet<VoiceAgentConfig>("/api/v1/voice-agent/config"),
  updateConfig: (config: Partial<VoiceAgentConfig>) =>
    apiPatch<VoiceAgentConfig>("/api/v1/voice-agent/config", config),
  syncEatNow: () =>
    apiPost<{ lastSync: string }>("/api/v1/voice-agent/eat-now/sync"),
};
