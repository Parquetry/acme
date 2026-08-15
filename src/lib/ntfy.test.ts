import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ntfyRequest, reminderPayload, sendNtfy } from "./ntfy";

describe("ntfy", () => {
  it("builds a clickable reminder request", () => {
    const request = ntfyRequest(
      reminderPayload({
        topic: "secret-topic",
        server: "https://ntfy.sh/",
        appUrl: "https://log.example",
      }),
    );

    assert.equal(request.url, "https://ntfy.sh/secret-topic");
    assert.equal(request.headers.Title, "Daily mental health log");
    assert.equal(request.headers.Click, "https://log.example");
    assert.match(request.headers.Actions || "", /Open log/);
    assert.equal(request.body, "Time to record today's PHQ-9 and GAD-7 scores.");
  });

  it("rejects empty or unsafe topics", () => {
    assert.throws(() => ntfyRequest({ topic: "  ", title: "x", message: "y" }), /required/);
    assert.throws(
      () => ntfyRequest({ topic: "foo/bar", title: "x", message: "y" }),
      /single path segment/,
    );
  });

  it("posts the reminder and surfaces HTTP errors", async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    await sendNtfy(
      reminderPayload({ topic: "secret-topic", alreadyLogged: true }),
      async (url, init) => {
        calls.push({ url: String(url), init: init || {} });
        return new Response("ok", { status: 200 });
      },
    );
    assert.equal(calls[0]?.url, "https://ntfy.sh/secret-topic");
    assert.equal(calls[0]?.init.method, "POST");

    await assert.rejects(
      () =>
        sendNtfy({ topic: "secret-topic", title: "x", message: "y" }, async () => {
          return new Response("nope", { status: 500 });
        }),
      /500/,
    );
  });
});
