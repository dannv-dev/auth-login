import { type NextRequest, NextResponse } from "next/server"
import { exchangeGoogleCode, getGoogleUser } from "@/lib/oauth"
import { findOrCreateOAuthUser, setSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("Google authentication failed")}`, request.url),
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("No authorization code received")}`, request.url),
      )
    }

    // Exchange code for access token
    const tokenResponse = await exchangeGoogleCode(code)

    if (tokenResponse.error) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("Failed to exchange code for token")}`, request.url),
      )
    }

    // Get user info from Google
    const googleUser = await getGoogleUser(tokenResponse.access_token)

    if (!googleUser.email) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("No email found in Google account")}`, request.url),
      )
    }

    // Find or create user
    const user = await findOrCreateOAuthUser(googleUser.email, googleUser.name, "google", googleUser.id)

    // Set session
    await setSession(user)

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Google callback error:", error)
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent("Authentication failed")}`, request.url))
  }
}
