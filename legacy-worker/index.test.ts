import { describe, expect, it } from "vitest";

import { buildRedirectLocation } from "./index";

describe("legacy brand redirect", () => {
  it("preserves the request path and query string", () => {
    expect(
      buildRedirectLocation(
        "https://investlens.mandoo4137-a53.workers.dev/search?query=AAPL&market=US",
      ),
    ).toBe(
      "https://impacticker.mandoo4137-a53.workers.dev/search?query=AAPL&market=US",
    );
  });

  it("redirects the legacy root to the Impacticker root", () => {
    expect(
      buildRedirectLocation("https://investlens.mandoo4137-a53.workers.dev/"),
    ).toBe("https://impacticker.mandoo4137-a53.workers.dev/");
  });
});
