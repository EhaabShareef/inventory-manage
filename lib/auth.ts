import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export type CurrentUser = {
  id: number
  username: string
  email: string | null
  role: string
} | null

export async function getCurrentUser(): Promise<CurrentUser> {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('token')?.value

    if (!token) {
      return null
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET is not set')
      return null
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: number }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true, role: true }
    })

    return user
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getCurrentUser: ", error.stack)
    }
    return null
  }
}