import { registerEnumType } from '@nestjs/graphql'
import { UserRoleEnum } from '@/db/schema'

registerEnumType(UserRoleEnum, {
  name: 'UserRole',
  description: 'The role of the user (student or teacher)',
})
