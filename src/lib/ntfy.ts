export type NtfyPayload = {
  topic: string;
  server?: string;
  title: string;
  message: string;
  clickUrl?: string;
  priority?: "min" | "low" | "default" | "high" | "urgent";
  tags?: string[];
};

export function ntfyRequest(payload: NtfyPayload): { url: string; headers: Record<string, string>; body: string } {
  const topic = payload.topic.trim();
  if (!topic) {
    throw new Error("ntfy topic is required");
  }
  if (/[/?#]/.test(topic)) {
    throw new Error("ntfy topic must be a single path segment");
  }

  const server = (payload.server || "https://ntfy.sh").replace(/\/+$/, "");
  const headers: Record<string, string> = {
    Title: payload.title,
    Priority: payload.priority || "default",
  };
  if (payload.tags?.length) {
    headers.Tags = payload.tags.join(",");
  }
  if (payload.clickUrl) {
    headers.Click = payload.clickUrl;
    headers.Actions = `view, Open log, ${payload.clickUrl}, clear=true`;
  }

  return {
    url: `${server}/${encodeURIComponent(topic)}`,
    headers,
    body: payload.message,
  };
}

export async function sendNtfy(
  payload: NtfyPayload,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const request = ntfyRequest(payload);
  const response = await fetchImpl(request.url, {
    method: "POST",
    headers: request.headers,
    body: request.body,
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`ntfy request failed (${response.status}): ${detail}`);
  }
}

export function reminderPayload(options: {
  topic: string;
  server?: string;
  appUrl?: string;
  alreadyLogged?: boolean;
}): NtfyPayload {
  return {
    topic: options.topic,
    server: options.server,
    title: options.alreadyLogged ? "Daily log already saved" : "Daily mental health log",
    message: options.alreadyLogged
      ? "Today's PHQ-9 and GAD-7 scores are already recorded."
      : "Time to record today's PHQ-9 and GAD-7 scores.",
    clickUrl: options.appUrl,
    tags: options.alreadyLogged ? ["white_check_mark"] : ["memo", "bell"],
  };
}
