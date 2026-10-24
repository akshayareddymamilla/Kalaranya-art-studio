import { ApiResponse } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') + '/api';

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('art_studio_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for sessions
  });

  let data: ApiResponse<T>;
  try {
    data = await res.json();
  } catch {
    throw new ApiError('Unexpected server response format', res.status);
  }

  if (!res.ok || !data.success) {
    const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
    throw new ApiError(errorMsg, res.status);
  }

  return data.data as T;
}
