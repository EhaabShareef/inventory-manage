'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

type LoginResult = 
  | { success: true }
  | { error: string }

async function logActivity(action: string, details: string, userId: number) {
  await prisma.auditLog.create({
    data: {
      action,
      details,
      userId,
    },
  });
}

export async function login(formData: FormData): Promise<LoginResult> {
  try {
    const username = formData.get('username')
    const password = formData.get('password')

    if (typeof username !== 'string' || typeof password !== 'string') {
      return { error: 'Invalid form data' }
    }

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return { error: 'User not found' }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return { error: 'Invalid password' }
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return { error: 'Server configuration error' }
    }

    const payload = {
      userId: user.id,
      role: user.role
    }

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' })

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 1 day in seconds
    })

    await logActivity('USER_LOGIN', `User ${user.username} logged in`, user.id)

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack)
    }
    return { error: 'An unexpected error occurred' }
  }
}

export async function registerUser(formData: FormData) {
  try {
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    const role = formData.get('role')

    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof role !== 'string'
    ) {
      return { error: 'Invalid form data' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role as 'VIEW' | 'MANAGE', 
      },
    })

    await logActivity('USER_REGISTERED', `New user registered: ${user.username}`, user.id)

    return { success: true, user }
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack)
    }
    return { error: 'Failed to register user' }
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

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
      console.log("Error: ", error.stack)
    }
    return null
  }
}

export async function logout() {
  try {
    const currentUser = await getCurrentUser()
    if (currentUser) {
      await logActivity('USER_LOGOUT', `User ${currentUser.username} logged out`, currentUser.id)
    }

    const cookieStore = await cookies()
    cookieStore.set('token', '', {
      expires: new Date(0),
      path: '/',
    })
    redirect('/')
  } catch (error) {
    if (error instanceof Error) {
      console.log("Logout Error: ", error.stack)
    }
    // Even if there's an error, we should still redirect to the login page
    redirect('/')
  }
}