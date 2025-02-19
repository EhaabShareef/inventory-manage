import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function authenticateUser(identifier: string, password: string) {
  // Check if identifier is email or username
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier }
      ]
    }
  })
  
  if (!user) return null

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) return null

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  )

  return { user, token }
}