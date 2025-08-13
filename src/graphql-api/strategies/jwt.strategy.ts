import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { getEnv } from '@/config/env'
import type { User } from '@/db/schema'
import { UserService } from '@/services/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getEnv().JWT_SECRET,
    })
  }

  async validate(payload: { sub: string; email: string }): Promise<User> {
    const user = await this.userService.findUserById(payload.sub)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
