const targetUrl = process.env.SMOKE_URL ?? "https://impacticker.mandoo4137-a53.workers.dev/";
const attempts = Number(process.env.SMOKE_ATTEMPTS ?? 8);
const delayMs = Number(process.env.SMOKE_DELAY_MS ?? 5_000);
const analyticsToken = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim();

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const createRequestOptions = () => ({
  cache: "no-store",
  headers: { "Cache-Control": "no-cache" },
  redirect: "follow",
  signal: AbortSignal.timeout(20_000),
});

const createRequestUrl = (path = new URL(targetUrl).pathname) => {
  const url = new URL(path, targetUrl);
  url.searchParams.set("smoke", `${Date.now()}`);
  return url;
};

async function verifyDeployment() {
  const origin = new URL(targetUrl).origin;
  const canonicalOrigin = process.env.SMOKE_CANONICAL_ORIGIN?.trim() || origin;
  const homeResponse = await fetch(createRequestUrl(), createRequestOptions());
  const homeBody = await homeResponse.text();
  const homeReady = homeResponse.ok
    && homeBody.includes("Impacticker")
    && homeBody.includes("<h1")
    && homeBody.includes("application/ld+json")
    && homeBody.includes(`href="${canonicalOrigin}"`);

  if (!homeReady) {
    return { ok: false, message: `${homeResponse.status} ${homeResponse.url}, expected SEO-ready Impacticker HTML` };
  }

  if (
    analyticsToken
    && (
      !homeBody.includes("https://static.cloudflareinsights.com/beacon.min.js")
      || !homeBody.includes(analyticsToken)
    )
  ) {
    return { ok: false, message: `${homeResponse.status} ${homeResponse.url}, Cloudflare Web Analytics beacon missing` };
  }

  const textChecks = [
    ["/robots.txt", ["User-Agent: *", "Sitemap:"]],
    ["/sitemap.xml", ["<urlset", canonicalOrigin, `${canonicalOrigin}/about`, `${canonicalOrigin}/methodology`, "<lastmod>"]],
    ["/manifest.webmanifest", ['"name":"Impacticker"', '"start_url":"/"']],
  ];

  for (const [path, expectedValues] of textChecks) {
    const response = await fetch(createRequestUrl(path), createRequestOptions());
    const body = await response.text();
    if (!response.ok || expectedValues.some((value) => !body.includes(value))) {
      return { ok: false, message: `${response.status} ${path}, invalid SEO metadata response` };
    }
  }

  const imageResponse = await fetch(createRequestUrl("/opengraph-image"), createRequestOptions());
  if (!imageResponse.ok || !imageResponse.headers.get("content-type")?.startsWith("image/png")) {
    return { ok: false, message: `${imageResponse.status} /opengraph-image, expected image/png` };
  }

  for (const path of ["/about", "/methodology"]) {
    const response = await fetch(createRequestUrl(path), createRequestOptions());
    const body = await response.text();
    const canonical = path === "/about" ? `${canonicalOrigin}/about` : `${canonicalOrigin}/methodology`;

    if (!response.ok || !body.includes("<h1") || !body.includes(`href="${canonical}"`)) {
      return { ok: false, message: `${response.status} ${path}, expected indexable public content` };
    }
  }

  for (const path of ["/login", "/dashboard"]) {
    const response = await fetch(createRequestUrl(path), createRequestOptions());
    const body = await response.text();

    if (!response.ok || !body.includes('name="robots"') || !body.includes("noindex")) {
      return { ok: false, message: `${response.status} ${path}, expected noindex metadata` };
    }
  }

  return { ok: true, message: `${homeResponse.status} ${homeResponse.url}` };
}

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const result = await verifyDeployment();

    if (result.ok) {
      console.log(`Smoke test passed: ${result.message} (${attempt}/${attempts})`);
      process.exit(0);
    }

    console.warn(`Smoke test pending: ${result.message} (${attempt}/${attempts})`);
  } catch (error) {
    console.warn(`Smoke test request failed (${attempt}/${attempts}): ${error.message}`);
  }

  if (attempt < attempts) {
    await sleep(delayMs);
  }
}

console.error(`Smoke test failed after ${attempts} attempts: ${targetUrl}`);
process.exit(1);
