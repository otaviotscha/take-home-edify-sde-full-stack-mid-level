import { Module } from '@nestjs/common'
import { UserResolver } from '@/graphql-api/graphql/resolvers/user.resolver'
import { UserRepository } from '@/repositories/user.repository'
import { HashService } from '@/services/hash.service'
import { UserService } from '@/services/user.service'

@Module({
  providers: [UserService, UserResolver, UserRepository, HashService],
  exports: [UserService],
})
export class UserModule {}
