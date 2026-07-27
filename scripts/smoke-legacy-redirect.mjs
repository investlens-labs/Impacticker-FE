const legacyOrigin =
  process.env.LEGACY_SMOKE_URL ?? "https://investlens.mandoo4137-a53.workers.dev";
const impactickerOrigin =
  process.env.SMOKE_URL ?? "https://impacticker.mandoo4137-a53.workers.dev";
const attempts = Number(process.env.SMOKE_ATTEMPTS ?? 8);
const delayMs = Number(process.env.SMOKE_DELAY_MS ?? 5_000);
const testPath = "/search?query=AAPL&market=US";

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const response = await fetch(new URL(testPath, legacyOrigin), {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
      redirect: "manual",
      signal: AbortSignal.timeout(20_000),
    });
    const expectedLocation = new URL(testPath, impactickerOrigin).toString();
    const actualLocation = response.headers.get("location");

    if (response.status === 301 && actualLocation === expectedLocation) {
      console.log(
        `Legacy redirect smoke test passed: ${response.status} ${actualLocation} (${attempt}/${attempts})`,
      );
      process.exit(0);
    }

    console.warn(
      `Legacy redirect pending: ${response.status} ${actualLocation ?? "missing location"} (${attempt}/${attempts})`,
    );
  } catch (error) {
    console.warn(
      `Legacy redirect request failed (${attempt}/${attempts}): ${error.message}`,
    );
  }

  if (attempt < attempts) {
    await sleep(delayMs);
  }
}

console.error(`Legacy redirect smoke test failed after ${attempts} attempts`);
process.exit(1);
