import { getSession, deleteSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar, LogOut } from "lucide-react"

async function logout() {
  "use server"
  await deleteSession()
  redirect("/")
}

export default async function Dashboard() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const { user } = session

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <form action={logout}>
            <Button variant="outline" type="submit">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Welcome Back</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.name}</div>
              <p className="text-xs text-muted-foreground">You are successfully logged in</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.email}</div>
              <p className="text-xs text-muted-foreground">Your registered email address</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Session</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">Your session is valid for 24 hours</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="text-lg font-semibold">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Account Status</label>
                <p className="text-lg font-semibold text-green-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
