import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { User } from '@/db/schema'
import type { Token } from '@/graphql-api/graphql/dtos/auth.dto'
import { HashService } from '@/services/hash.service'
import { UserService } from '@/services/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne(email)
    if (user && (await this.hashService.compare(password, user.passwordHash))) {
      return user
    }
    return null
  }

  async login(user: User): Promise<Token> {
    const payload = { email: user.email, sub: user.id }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}
