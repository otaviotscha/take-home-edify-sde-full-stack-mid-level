import { Module } from '@nestjs/common'
import { UserResolver } from '@/graphql-api/graphql/resolvers/user.resolver'
import { HashService } from '@/services/hash.service'
import { UserService } from '@/services/user.service'

@Module({
  providers: [UserService, UserResolver, HashService],
  exports: [UserService],
})
export class UserModule {}
