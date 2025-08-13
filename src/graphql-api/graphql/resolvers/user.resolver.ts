import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@/graphql-api/decorators/current-user.decorator'
import { Roles } from '@/graphql-api/decorators/roles.decorator'
import { CreateUserInput, UpdateUserInput, UserResponse } from '@/graphql-api/graphql/dtos/user.dto'
import { GqlAuthRolesGuard } from '@/graphql-api/graphql/guards/gql-auth-roles.guard'
import { SelfOrAdminGuard } from '@/graphql-api/graphql/guards/self-or-admin.guard'
import { UserService } from '@/services/user.service'

@Resolver(() => UserResponse)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResponse)
  @UseGuards(GqlAuthRolesGuard, SelfOrAdminGuard)
  me(@CurrentUser() user: UserResponse) {
    return this.userService.findUserById(user.id)
  }
  @Query(() => [UserResponse])
  @Roles('TEACHER')
  @UseGuards(GqlAuthRolesGuard)
  async users() {
    return this.userService.findAllUsers()
  }

  @Query(() => UserResponse, { name: 'user' })
  @UseGuards(GqlAuthRolesGuard, SelfOrAdminGuard)
  async getUser(@Args('id', { type: () => String }) id: string) {
    return this.userService.findUserById(id)
  }

  @Mutation(() => UserResponse)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input)
  }

  @Mutation(() => UserResponse)
  @UseGuards(GqlAuthRolesGuard, SelfOrAdminGuard)
  async updateUser(@CurrentUser() user: UserResponse, @Args('input') input: UpdateUserInput) {
    return this.userService.updateUser({ ...input, id: user.id })
  }

  @Mutation(() => UserResponse)
  @UseGuards(GqlAuthRolesGuard, SelfOrAdminGuard)
  async deleteUser(@Args('id', { type: () => String }) id: string) {
    return this.userService.deleteUser(id)
  }
}
