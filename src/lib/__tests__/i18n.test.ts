import { describe, expect, it } from "vitest";
import { withLocalePrefix } from "@/lib/i18n";

describe("withLocalePrefix", () => {
  it("prepends the locale to internal links", () => {
    expect(withLocalePrefix("en", "/contact")).toBe("/en/contact");
    expect(withLocalePrefix("es", "/contact")).toBe("/es/contact");
    expect(withLocalePrefix("en", "/services")).toBe("/en/services");
  });

  it("leaves already-prefixed links untouched", () => {
    expect(withLocalePrefix("en", "/en/contact")).toBe("/en/contact");
    expect(withLocalePrefix("es", "/es/contact")).toBe("/es/contact");
    expect(withLocalePrefix("en", "/en")).toBe("/en");
    expect(withLocalePrefix("es", "/es")).toBe("/es");
  });

  it("maps the root path to the locale home", () => {
    expect(withLocalePrefix("en", "/")).toBe("/en");
    expect(withLocalePrefix("es", "/")).toBe("/es");
  });

  it("leaves external and non-path links untouched", () => {
    expect(withLocalePrefix("en", "https://example.com/x")).toBe(
      "https://example.com/x"
    );
    expect(withLocalePrefix("en", "mailto:hello@example.com")).toBe(
      "mailto:hello@example.com"
    );
    expect(withLocalePrefix("en", "tel:+1234567890")).toBe("tel:+1234567890");
    expect(withLocalePrefix("en", "#pricing")).toBe("#pricing");
  });

  it("trims whitespace", () => {
    expect(withLocalePrefix("en", " /contact ")).toBe("/en/contact");
  });
});