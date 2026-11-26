export const API_URL =
  import.meta.env.VITE_API_URL || "https://home-assist-api.onrender.com";

export interface Guide {
  id: string;
  title: string;
  object?: string;
  problem?: string;
  difficulty?: string;
  minutes?: number;
  category?: string;
  emoji?: string;
  tools?: string[];
  materials?: string[];
  safetyNotes?: string[];
  steps?: string[];
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${API_URL}${cleanPath}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function getGuides(): Promise<Guide[]> {
  return apiFetch<Guide[]>("/api/guides");
}
