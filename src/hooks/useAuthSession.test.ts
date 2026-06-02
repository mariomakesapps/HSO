import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@supabase/supabase-js";

const invokeMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: (...args: any[]) => invokeMock(...args) },
  },
}));

vi.mock("@/store/collections", () => ({
  store: { setUser: () => {} },
}));

import { sendWelcomeEmailIfNew } from "./useAuthSession";

function makeSession(overrides: Partial<{ id: string; email: string; created_at: string; user_metadata: Record<string, any> }> = {}): Session {
  const user = {
    id: overrides.id ?? "user-new-1",
    email: overrides.email ?? "new@example.com",
    created_at: overrides.created_at ?? new Date().toISOString(),
    user_metadata: overrides.user_metadata ?? {},
  } as any;
  return { user } as Session;
}

describe("sendWelcomeEmailIfNew", () => {
  beforeEach(() => {
    invokeMock.mockReset();
    invokeMock.mockResolvedValue({ data: { success: true }, error: null });
    localStorage.clear();
  });

  it("sends exactly one welcome email when a brand-new account signs in (email-confirmation OFF — immediate SIGNED_IN after signup)", async () => {
    const session = makeSession({ id: "u-auto", user_metadata: { first_name: "Ada" } });

    // Simulate the SIGNED_IN event firing immediately after signup.
    await sendWelcomeEmailIfNew(session);
    // Simulate a tab focus / token refresh that re-emits SIGNED_IN.
    await sendWelcomeEmailIfNew(session);
    await sendWelcomeEmailIfNew(session);

    expect(invokeMock).toHaveBeenCalledTimes(1);
    expect(invokeMock).toHaveBeenCalledWith("send-transactional-email", {
      body: {
        templateName: "welcome",
        recipientEmail: "new@example.com",
        idempotencyKey: "welcome-u-auto",
        templateData: { firstName: "Ada" },
      },
    });
  });

  it("sends exactly one welcome email when the user confirms their email later (email-confirmation ON — first SIGNED_IN happens after verify)", async () => {
    // created_at is recent (within 24h) because the row was just inserted at signup,
    // and the first SIGNED_IN event fires when the user clicks the confirmation link.
    const session = makeSession({
      id: "u-confirm",
      email: "confirm@example.com",
      created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 min ago
    });

    await sendWelcomeEmailIfNew(session); // post-confirmation SIGNED_IN
    await sendWelcomeEmailIfNew(session); // subsequent login on another device

    expect(invokeMock).toHaveBeenCalledTimes(1);
    expect(invokeMock.mock.calls[0][1].body.idempotencyKey).toBe("welcome-u-confirm");
    // No first_name in metadata -> templateData omitted
    expect(invokeMock.mock.calls[0][1].body.templateData).toEqual({});
  });

  it("does not send when an existing user (account older than 24h) signs in", async () => {
    const session = makeSession({
      id: "u-old",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 48h ago
    });

    await sendWelcomeEmailIfNew(session);

    expect(invokeMock).not.toHaveBeenCalled();
  });

  it("does nothing for a null/empty session", async () => {
    await sendWelcomeEmailIfNew(null);
    await sendWelcomeEmailIfNew({ user: { id: "x", email: undefined } } as any);
    expect(invokeMock).not.toHaveBeenCalled();
  });

  it("clears the dedupe marker if the send fails so a later attempt can retry", async () => {
    invokeMock.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    const session = makeSession({ id: "u-retry" });

    await sendWelcomeEmailIfNew(session); // fails -> marker cleared
    await sendWelcomeEmailIfNew(session); // retries

    expect(invokeMock).toHaveBeenCalledTimes(2);
  });
});
