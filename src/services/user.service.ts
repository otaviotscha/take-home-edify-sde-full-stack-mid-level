import { Injectable, NotFoundException } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { CreateUserInput, UpdateUserInput } from '@/graphql-api/graphql/dtos/user.dto'
import { HashService } from '@/services/hash.service'

@Injectable()
export class UserService {
  constructor(private readonly hashService: HashService) {}

  async createUser(input: CreateUserInput) {
    const hashedPassword = await this.hashService.hash(input.password)
    const [newUser] = await db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        passwordHash: hashedPassword,
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
    if (!user.length) {
      return null
    }
    return user[0]
  }

  async updateUser(input: UpdateUserInput) {
    const { id, password, ...userData } = input
    let passwordHash: string | undefined

    if (password) {
      passwordHash = await this.hashService.hash(password)
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        ...userData,
        ...(passwordHash && { passwordHash }),
      })
      .where(eq(users.id, id))
      .returning()

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`)
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
