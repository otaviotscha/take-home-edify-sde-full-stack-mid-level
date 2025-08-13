import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@/graphql-api/decorators/current-user.decorator'
import { Roles } from '@/graphql-api/decorators/roles.decorator'
import { CreateUserInput, UpdateUserInput, User } from '@/graphql-api/graphql/dtos/user.dto'
import { GqlAuthRolesGuard } from '@/graphql-api/guards/gql-auth-roles.guard'
import { SelfOrAdminGuard } from '@/graphql-api/guards/self-or-admin.guard'
import { UserService } from '@/services/user.service'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(GqlAuthRolesGuard, SelfOrAdminGuard)
  me(@CurrentUser() user: User) {
    return this.userService.findUserById(user.id)
  }
  @Query(() => [User])
  @Roles('TEACHER')
  @UseGuards(GqlAuthRolesGuard)
  async users() {
    return this.userService.findAllUsers()
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(GqlAuthRolesGuard, SelfOrAdminGuard)
  async getUser(@Args('id', { type: () => String }) id: string) {
    return this.userService.findUserById(id)
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input)
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthRolesGuard, SelfOrAdminGuard)
  async updateUser(@Args('input') input: UpdateUserInput) {
    return this.userService.updateUser(input)
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthRolesGuard, SelfOrAdminGuard)
  async deleteUser(@Args('id', { type: () => String }) id: string) {
    return this.userService.deleteUser(id)
  }
}
