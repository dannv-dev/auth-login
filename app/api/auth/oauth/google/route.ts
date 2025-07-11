import { NextResponse } from "next/server"
import { getGoogleAuthUrl } from "@/lib/oauth"

export async function GET() {
  try {
    const authUrl = getGoogleAuthUrl()

    // Return the URL as JSON instead of redirecting
    // This allows the frontend to handle the redirect
    return NextResponse.json({
      success: true,
      authUrl,
      message: "Redirect to Google OAuth",
    })
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initiate Google OAuth",
      },
      { status: 500 },
    )
  }
}
