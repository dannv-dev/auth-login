import { type NextRequest, NextResponse } from "next/server"
import { exchangeGitHubCode, getGitHubUser } from "@/lib/oauth"
import { findOrCreateOAuthUser, setSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("GitHub authentication failed")}`, request.url),
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("No authorization code received")}`, request.url),
      )
    }

    // Exchange code for access token
    const tokenResponse = await exchangeGitHubCode(code)

    if (tokenResponse.error) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("Failed to exchange code for token")}`, request.url),
      )
    }

    // Get user info from GitHub
    const githubUser = await getGitHubUser(tokenResponse.access_token)

    if (!githubUser.email) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("No email found in GitHub account")}`, request.url),
      )
    }

    // Find or create user
    const user = await findOrCreateOAuthUser(
      githubUser.email,
      githubUser.name || githubUser.login,
      "github",
      githubUser.id.toString(),
    )

    // Set session
    await setSession(user)

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("GitHub callback error:", error)
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent("Authentication failed")}`, request.url))
  }
}
