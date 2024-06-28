import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["es", "ca", "en"],

  // Used when no locale matches
  defaultLocale: "es",

  localePrefix: "always",
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(es|ca|en)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
