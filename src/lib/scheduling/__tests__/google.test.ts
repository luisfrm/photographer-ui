import { describe, expect, it } from "vitest";
import {
  buildAuthUrl,
  buildEventPayload,
  generateOAuthState,
  isTokenExpired,
  GOOGLE_SCOPE,
} from "@/lib/scheduling/google";
import type { GoogleTokens } from "@/types/scheduling";

const tokens = (overrides: Partial<GoogleTokens> = {}): GoogleTokens => ({
  access_token: "access",
  refresh_token: "refresh",
  scope: GOOGLE_SCOPE,
  token_type: "Bearer",
  expires_at: Date.now() + 3600_000,
  ...overrides,
});

describe("buildAuthUrl", () => {
  it("builds an OAuth URL with the expected params", () => {
    const url = buildAuthUrl({
      clientId: "client-id",
      redirectUri: "https://example.com/api/google/callback",
      state: "state-123",
    });

    const parsed = new URL(url);
    expect(parsed.origin).toBe("https://accounts.google.com");
    expect(parsed.searchParams.get("client_id")).toBe("client-id");
    expect(parsed.searchParams.get("redirect_uri")).toBe(
      "https://example.com/api/google/callback"
    );
    expect(parsed.searchParams.get("response_type")).toBe("code");
    expect(parsed.searchParams.get("access_type")).toBe("offline");
    expect(parsed.searchParams.get("prompt")).toBe("consent");
    expect(parsed.searchParams.get("state")).toBe("state-123");
    expect(parsed.searchParams.get("scope")).toContain("calendar.events");
  });
});

describe("buildEventPayload", () => {
  it("builds an event with naive local datetimes and a timezone", () => {
    const payload = buildEventPayload({
      summary: "Photo session — Jane Doe",
      description: "Golden hour portraits",
      startDateTime: "2026-09-02T09:00:00",
      endDateTime: "2026-09-02T10:30:00",
      timeZone: "America/Denver",
      attendeeEmail: "jane@example.com",
    });

    expect(payload.summary).toBe("Photo session — Jane Doe");
    expect(payload.description).toBe("Golden hour portraits");
    expect(payload.start).toEqual({
      dateTime: "2026-09-02T09:00:00",
      timeZone: "America/Denver",
    });
    expect(payload.end).toEqual({
      dateTime: "2026-09-02T10:30:00",
      timeZone: "America/Denver",
    });
    expect(payload.attendees).toEqual([{ email: "jane@example.com" }]);
  });

  it("omits attendees/description when not provided", () => {
    const payload = buildEventPayload({
      summary: "Test",
      startDateTime: "2026-09-02T09:00:00",
      endDateTime: "2026-09-02T10:00:00",
      timeZone: "UTC",
    });

    expect(payload.attendees).toBeUndefined();
    expect(payload.description).toBeUndefined();
  });
});

describe("isTokenExpired", () => {
  it("flags expired tokens with a safety margin", () => {
    expect(isTokenExpired(tokens({ expires_at: Date.now() - 1000 }))).toBe(true);
    expect(
      isTokenExpired(tokens({ expires_at: Date.now() + 10_000 }))
    ).toBe(true); // inside the 60s skew
    expect(
      isTokenExpired(tokens({ expires_at: Date.now() + 120_000 }))
    ).toBe(false);
  });
});

describe("generateOAuthState", () => {
  it("generates a 64-char hex state", () => {
    const state = generateOAuthState();
    expect(state).toMatch(/^[0-9a-f]{64}$/);
  });
});