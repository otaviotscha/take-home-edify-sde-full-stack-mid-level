import { Injectable, NotFoundException } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { type CreateUser, type UpdateUser, type User, users } from '@/db/schema'

@Injectable()
export class UserRepository {
  async createUser(data: CreateUser): Promise<User | null> {
    const [newUser] = await db.insert(users).values(data).returning()
    return newUser ?? null
  }

  async findAllUsers(): Promise<User[]> {
    return db.select().from(users)
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1)
    if (!user.length) {
      throw new NotFoundException(`User with ID "${id}" not found`)
    }
    return user[0] ?? null
  }

  async findOne(email: string): Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1)
    return user.length ? (user[0] ?? null) : null
  }

  async updateUser(data: UpdateUser): Promise<User> {
    if (!data.id) {
      throw new NotFoundException('No user ID provided')
    }

    const [updatedUser] = await db.update(users).set(data).where(eq(users.id, data.id)).returning()

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${data.id}" not found`)
    }
    return updatedUser
  }

  async deleteUser(id: string): Promise<User> {
    const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning()
    if (!deletedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`)
    }
    return deletedUser
  }
}
