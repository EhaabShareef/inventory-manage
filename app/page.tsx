'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/actions/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await login(formData)
      if ('error' in result && result.error) {
        setError(result.error)
      } else if ('success' in result && result.success) {
        router.push('/admin/dashboard')
      } else {
        setError('An unexpected error occurred')
      }
    } catch (error) {
      console.error('Client-side error:', error)
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-accent">
      <Card className="w-[400px] shadow-lg border-none">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="HTM Logo" className="w-24 h-24" />
          </div>
          <CardTitle className="text-2xl text-center">HTM Inventory Manager</CardTitle>
          <CardDescription className="text-center">Enter your credentials to login</CardDescription>
        </CardHeader>
        <CardContent>

          {error && (
            <Alert variant="destructive" className='my-2 py-3'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form action={handleSubmit} className='space-y-4'>
            <div className="space-y-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <Input 
                id="username" 
                name="username"
                type="text" 
                placeholder="Enter your username or email"
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
            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className='text-xs text-muted-foreground text-center w-full'>v1.0</p>
        </CardFooter>
      </Card>
    </div>
  )
}