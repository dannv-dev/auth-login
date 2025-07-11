import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.JWT_SECRET || "your-secret-key-here"
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  })
  return payload
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value
  if (!session) return null
  return await decrypt(session)
}

export async function setSession(user: any) {
  const session = await encrypt({ user, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
  ;(await cookies()).set("session", session, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
}

export async function deleteSession() {
  ;(await cookies()).delete("session")
}

// Mock user database - replace with real database
const users = [
  { id: 1, email: "demo@example.com", password: "password123", name: "Demo User" },
  { id: 2, email: "admin@example.com", password: "admin123", name: "Admin User" },
]

export async function verifyUser(email: string, password: string) {
  const user = users.find((u) => u.email === email && u.password === password)
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export async function createUser(email: string, password: string, name: string) {
  // Check if user already exists
  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    return null // User already exists
  }

  // Create new user (in a real app, hash the password)
  const newUser = {
    id: users.length + 1,
    email,
    password, // In production, hash this password
    name,
  }

  users.push(newUser)

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

export async function findOrCreateOAuthUser(email: string, name: string, provider: string, providerId: string) {
  // Check if user exists by email
  let user = users.find((u) => u.email === email)

  if (!user) {
    // Create new user for OAuth
    const newUser = {
      id: users.length + 1,
      email,
      password: "", // OAuth users don't have passwords
      name,
      provider,
      providerId,
    }

    users.push(newUser as any)
    user = newUser as any
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
