export interface ApiError extends Error {
  status?: number;
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
  } = {}
): Promise<T> {
  const { method = 'GET', body } = options;
  const res = await fetch(path, {
    method,
    credentials: 'include',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!res.ok) {
    const error = new Error(data?.error || `Request failed (${res.status})`) as ApiError;
    error.status = res.status;
    throw error;
  }

  return data as T;
}

