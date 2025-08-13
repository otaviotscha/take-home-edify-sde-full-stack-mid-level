import { Injectable, NotFoundException } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import type { CreateUserInput, UpdateUserInput } from '@/graphql-api/graphql/dtos/user.dto'

@Injectable()
export class UserRepository {
  async createUser(input: CreateUserInput) {
    const [newUser] = await db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        passwordHash: input.password,
        role: input.role,
      })
      .returning()

    return newUser
  }

  async findAllUsers() {
    return db.select().from(users)
  }

  async findUserById(id: string) {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1)
    if (!user.length) {
      throw new NotFoundException(`User with ID "${id}" not found`)
    }
    return user[0]
  }

  async findOne(email: string) {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1)
    return user.length ? user[0] : null
  }

  async updateUser(input: UpdateUserInput) {
    const [updatedUser] = await db
      .update(users)
      .set({
        name: input.name,
        email: input.email,
        role: input.role,
        ...(input.password && { passwordHash: input.password }),
      })
      .where(eq(users.id, input.id))
      .returning()

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${input.id}" not found`)
    }
    return updatedUser
  }

  async deleteUser(id: string) {
    const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning()
    if (!deletedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`)
    }
    return deletedUser
  }
}
