import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "early-access";
const SOCIAL_CRAWLER_USER_AGENT_REGEX =
  /(Twitterbot|facebookexternalhit|Slackbot|Discordbot|WhatsApp|TelegramBot|LinkedInBot|Slack-ImgProxy|Googlebot|bingbot)/i;

function isDocsPagePath(pathname: string) {
  if (pathname === "/docs") return true;
  if (!pathname.startsWith("/docs/")) return false;
  return !pathname.endsWith(".md");
}

function isSocialCrawlerRequest(request: NextRequest) {
  if (request.method === "HEAD") return true;
  const userAgent = request.headers.get("user-agent");
  if (!userAgent) return false;
  return SOCIAL_CRAWLER_USER_AGENT_REGEX.test(userAgent);
}

export function proxy(request: NextRequest) {
  // Temporary early-access gate.
  // - Turn it off by setting EARLY_ACCESS_ENABLED != "true"
  // - Or delete this `proxy.ts` file entirely (recommended for cleanup)
  // Cleanup checklist when removing early access:
  // - delete `proxy.ts`
  // - delete `app/access/page.tsx`
  // - delete `app/api/access/route.ts`
  // - remove EARLY_ACCESS_* env vars
  if (process.env.EARLY_ACCESS_ENABLED !== "true") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  const hasAccess = request.cookies.get(COOKIE_NAME)?.value === "granted";

  if (pathname === "/access" && hasAccess) {
    return NextResponse.redirect(new URL("/docs/introduction", request.url));
  }

  // skip for these paths
  if (
    pathname.startsWith("/access") ||
    pathname.startsWith("/api/access") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    (pathname.includes(".") && !pathname.endsWith(".md"))
  ) {
    return NextResponse.next();
  }

  // Allow social crawlers to fetch docs pages so link previews can read metadata.
  // Note: User-Agent spoofing is possible; keep this only while early-access is temporary.
  if (!hasAccess && isDocsPagePath(pathname) && isSocialCrawlerRequest(request)) {
    return NextResponse.next();
  }

  if (!hasAccess) {
    return NextResponse.redirect(new URL("/access", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
