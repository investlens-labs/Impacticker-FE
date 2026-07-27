const IMPACTICKER_ORIGIN = "https://impacticker.mandoo4137-a53.workers.dev";

export function buildRedirectLocation(requestUrl: string): string {
  const sourceUrl = new URL(requestUrl);
  return new URL(`${sourceUrl.pathname}${sourceUrl.search}`, IMPACTICKER_ORIGIN).toString();
}

export default {
  fetch(request: Request): Response {
    return Response.redirect(buildRedirectLocation(request.url), 301);
  },
};
