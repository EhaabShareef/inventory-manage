'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/actions/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await registerUser(formData)
      if ('error' in result && result.error) {
        setError(result.error)
      } else if ('success' in result && result.success) {
        router.push('/login')
      } else {
        setError('An unexpected error occurred')
      }
    } catch (error) {
      console.error('Client-side error:', error)
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Register</CardTitle>
          <CardDescription className="text-center">Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form action={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  name="username"
                  type="text" 
                  placeholder="Enter your username"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="Enter your email"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password"
                  placeholder="Enter your password" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue="VIEW">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIEW">View</SelectItem>
                    <SelectItem value="MANAGE">Manage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" type="submit">
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}