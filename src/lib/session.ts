import { cookies } from "next/headers";
import { isValidSession, SESSION_COOKIE } from "./auth";

export async function requireSession(): Promise<boolean> {
  const jar = await cookies();
  return isValidSession(jar.get(SESSION_COOKIE)?.value);
}
