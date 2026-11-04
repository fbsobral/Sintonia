import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher(["/tourtest", "/", "/sign-in(.*)", "/sign-up(.*)", "/convite(.*)", "/api/cron(.*)", "/api/health", "/robots.txt", "/apple-icon(.*)", "/icon(.*)", "/manifest.webmanifest"]);

export default clerkMiddleware(
  async (auth, req) => {
    if (!isPublic(req)) await auth.protect();
  },
  {
    // CSP com nonce por requisição (Clerk injeta o nonce e cuida das origens dele).
    // Em desenvolvimento só reporta, porque o HMR do Next precisa de eval.
    contentSecurityPolicy: {
      strict: true,
      reportOnly: process.env.NODE_ENV !== "production",
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", "blob:", "https://img.clerk.com"],
        "font-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'none'"],
      },
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
