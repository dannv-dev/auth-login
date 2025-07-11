// OAuth configuration and utilities
export const oauthConfig = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || "demo_client_id",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "demo_client_secret",
    redirectUri: (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000") + "/api/auth/callback/github",
    scope: "user:email",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "demo_client_id",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo_client_secret",
    redirectUri: (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000") + "/api/auth/callback/google",
    scope: "openid email profile",
  },
}

export function getGitHubAuthUrl() {
  // Check if we have valid OAuth credentials
  if (!process.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID === "demo_client_id") {
    throw new Error(
      "GitHub OAuth not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.",
    )
  }

  const params = new URLSearchParams({
    client_id: oauthConfig.github.clientId,
    redirect_uri: oauthConfig.github.redirectUri,
    scope: oauthConfig.github.scope,
    response_type: "code",
  })

  return `https://github.com/login/oauth/authorize?${params.toString()}`
}

export function getGoogleAuthUrl() {
  // Check if we have valid OAuth credentials
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === "demo_client_id") {
    throw new Error(
      "Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.",
    )
  }

  const params = new URLSearchParams({
    client_id: oauthConfig.google.clientId,
    redirect_uri: oauthConfig.google.redirectUri,
    scope: oauthConfig.google.scope,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export async function exchangeGitHubCode(code: string) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: oauthConfig.github.clientId,
      client_secret: oauthConfig.github.clientSecret,
      code,
    }),
  })

  return response.json()
}

export async function exchangeGoogleCode(code: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: oauthConfig.google.clientId,
      client_secret: oauthConfig.google.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: oauthConfig.google.redirectUri,
    }),
  })

  return response.json()
}

export async function getGitHubUser(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  })

  return response.json()
}

export async function getGoogleUser(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.json()
}
