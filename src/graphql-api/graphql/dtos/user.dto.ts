import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator'

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'The role of the user (student or teacher)',
})

@ObjectType()
export class User {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string

  @Field(() => UserRole)
  role!: UserRole
}

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  name!: string

  @Field(() => String)
  @IsEmail()
  email!: string

  @Field(() => String)
  @IsString()
  @MinLength(8)
  password!: string

  @Field(() => UserRole)
  @IsEnum(UserRole)
  role!: UserRole
}

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  @IsUUID()
  id!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}

@InputType()
export class LoginUserInput {
  @Field(() => String)
  @IsEmail()
  email!: string

  @Field(() => String)
  @IsString()
  password!: string
}
