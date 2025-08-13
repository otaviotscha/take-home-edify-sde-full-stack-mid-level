import '@/graphql-api/graphql/enums/user-role.enum'
import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator'
import { UserRoleEnum } from '@/db/schema'

@ObjectType()
export class UserResponse {
  @Field(() => String)
  @IsUUID()
  id!: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name!: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @Field(() => UserRoleEnum)
  @IsEnum(UserRoleEnum)
  role!: UserRoleEnum
}

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name!: string

  @Field(() => String)
  @IsEmail()
  email!: string

  @Field(() => String)
  @IsString()
  @MinLength(8)
  password!: string

  @Field(() => UserRoleEnum)
  @IsEnum(UserRoleEnum)
  role!: UserRoleEnum
}

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  id?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string
}

@InputType()
export class LoginUserInput {
  @Field(() => String)
  @IsEmail()
  email!: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password!: string
}
