import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { getEnv } from '@/config/env'
import { AuthResolver } from '@/graphql-api/graphql/resolvers/auth.resolver'
import { GqlAuthGuard } from '@/graphql-api/guards/gql-auth.guard'
import { GqlLocalAuthGuard } from '@/graphql-api/guards/gql-local-auth.guard'
import { HashModule } from '@/graphql-api/modules/hash.module'
import { UserModule } from '@/graphql-api/modules/user.module'
import { JwtStrategy } from '@/graphql-api/strategies/jwt.strategy'
import { LocalStrategy } from '@/graphql-api/strategies/local.strategy'
import { AuthService } from '@/services/auth.service'

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
