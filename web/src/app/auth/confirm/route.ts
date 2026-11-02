// Landing page for the "confirm your email" link. The email template links to
// /auth/confirm?token_hash=...&type=email (supabase/templates/confirmation.html).
import { NextResponse, type NextRequest } from "next/server";
import { backend } from "@/lib/data";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  // Behind nginx, Next takes itself for localhost:3000, so redirect to the public
  // address in SITE_URL, not to the address the request came in on.
  const site = (process.env.SITE_URL || request.nextUrl.origin).replace(/\/$/, "");

  if (tokenHash && type && (await backend.confirmEmail(tokenHash, type))) {
    return NextResponse.redirect(`${site}/today`);
  }
  return NextResponse.redirect(`${site}/signin?confirm=failed`);
}
