import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import type { User } from '@/db/schema'
import { CurrentUser } from '@/graphql-api/decorators/current-user.decorator'
import { LoginInput, Token } from '@/graphql-api/graphql/dtos/auth.dto'
import { GqlLocalAuthGuard } from '@/graphql-api/graphql/guards/gql-local-auth.guard'
import { AuthService } from '@/services/auth.service'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Token)
  @UseGuards(GqlLocalAuthGuard)
  async login(@Args('input') _input: LoginInput, @CurrentUser() user: User): Promise<Token> {
    return this.authService.login(user)
  }
}
