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

  async createUser(data: CreateUserInput) {
    const passwordHash = await this.hashService.hash(data.password)
    return this.userRepository.createUser({ ...data, passwordHash })
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

  async updateUser(data: UpdateUserInput) {
    const newData = { ...data }
    if (data.password) {
      newData.password = await this.hashService.hash(data.password)
    }
    return this.userRepository.updateUser(newData)
  }

  async deleteUser(id: string) {
    return this.userRepository.deleteUser(id)
  }
}
