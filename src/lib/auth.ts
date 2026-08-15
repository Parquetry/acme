export const SESSION_COOKIE = "daily_log_session";

export function passwordEnabled(): boolean {
  return Boolean(process.env.APP_PASSWORD);
}

export async function sessionToken(password = process.env.APP_PASSWORD || ""): Promise<string> {
  const bytes = new TextEncoder().encode(`daily-log:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function isValidPassword(candidate: string): boolean {
  const expected = process.env.APP_PASSWORD || "";
  if (!expected) return true;
  return safeEqual(candidate, expected);
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!passwordEnabled()) return true;
  if (!token) return false;
  return safeEqual(token, await sessionToken());
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}
