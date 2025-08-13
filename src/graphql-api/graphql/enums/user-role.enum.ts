import { registerEnumType } from '@nestjs/graphql'

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'The role of the user (student or teacher)',
})
