import { NextResponse } from "next/server";

const DEFAULT_HEADERS = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
} as const;

export const jsonNoStore = (body: unknown, init?: ResponseInit) =>
  NextResponse.json(body, {
    ...init,
    headers: {
      ...DEFAULT_HEADERS,
      ...(init?.headers ?? {}),
    },
  });

export const errorJson = (status: number, message: string, extra?: Record<string, unknown>) =>
  jsonNoStore(
    {
      success: false,
      message,
      ...extra,
    },
    { status }
  );
