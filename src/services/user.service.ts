import { Injectable } from '@nestjs/common'
import type { CreateUserInput, UpdateUserInput } from '@/graphql-api/graphql/dtos/user.dto'
import { UserRepository } from '@/repositories/user.repository'
import { HashService } from '@/services/hash.service'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService
  ) {}

  async createUser(input: CreateUserInput) {
    const passwordHash = await this.hashService.hash(input.password)
    return this.userRepository.createUser({ ...input, password: passwordHash })
  }

  async findAllUsers() {
    return this.userRepository.findAllUsers()
  }

  async findUserById(id: string) {
    return this.userRepository.findUserById(id)
  }

  async findOne(email: string) {
    return this.userRepository.findOne(email)
  }

  async updateUser(input: UpdateUserInput) {
    let passwordHash: string | undefined
    if (input.password) {
      passwordHash = await this.hashService.hash(input.password)
    }
    return this.userRepository.updateUser({ ...input, password: passwordHash })
  }

  async deleteUser(id: string) {
    return this.userRepository.deleteUser(id)
  }
}
