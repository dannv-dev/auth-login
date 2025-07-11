import { NextResponse } from "next/server"
import { getGitHubAuthUrl } from "@/lib/oauth"

export async function GET() {
  try {
    const authUrl = getGitHubAuthUrl()

    // Return the URL as JSON instead of redirecting
    // This allows the frontend to handle the redirect
    return NextResponse.json({
      success: true,
      authUrl,
      message: "Redirect to GitHub OAuth",
    })
  } catch (error) {
    console.error("GitHub OAuth error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initiate GitHub OAuth",
      },
      { status: 500 },
    )
  }
}
