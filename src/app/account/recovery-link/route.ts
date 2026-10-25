import { NextRequest, NextResponse } from "next/server";

/** Email scanners may GET this URL: never consume recovery proof here. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const valid =
    request.nextUrl.searchParams.get("type") === "recovery" &&
    token !== null &&
    /^[A-Za-z0-9_-]{32,256}$/.test(token);
  // Relative redirect never trusts redirect_to or a caller-supplied origin.
  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: valid
        ? `/account/reset#token=${encodeURIComponent(token!)}`
        : "/account/reset#invalid",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
