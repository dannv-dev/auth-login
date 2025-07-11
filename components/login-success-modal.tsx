"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle, User, Mail } from "lucide-react"

interface LoginSuccessModalProps {
  isOpen: boolean
  user: {
    name: string
    email: string
  } | null
  onClose: () => void
}

export function LoginSuccessModal({ isOpen, user, onClose }: LoginSuccessModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white animate-in zoom-in-95 duration-300">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Login Successful!</h2>
          <p className="text-gray-600">Welcome back to your account</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {user && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Continue to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
