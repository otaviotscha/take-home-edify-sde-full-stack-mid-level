import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { getEnv } from '@/config/env'
import { AuthResolver } from '@/graphql-api/graphql/resolvers/auth.resolver'
import { HashModule } from '@/graphql-api/modules/hash.module'
import { UserModule } from '@/graphql-api/modules/user.module'
import { GqlAuthGuard } from '@/guards/gql-auth.guard'
import { GqlLocalAuthGuard } from '@/guards/gql-local-auth.guard'
import { AuthService } from '@/services/auth.service'
import { JwtStrategy } from '@/strategies/jwt.strategy'
import { LocalStrategy } from '@/strategies/local.strategy'

@Module({
  imports: [
    UserModule,
    HashModule,
    PassportModule,
    JwtModule.register({
      secret: getEnv().JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, LocalStrategy, GqlLocalAuthGuard, GqlAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
