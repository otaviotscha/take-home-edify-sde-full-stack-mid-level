import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator'
import { UserRole } from '@/graphql-api/graphql/enums/user-role.enum'

@ObjectType()
export class User {
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

  @Field(() => UserRole)
  @IsEnum(UserRole)
  role!: UserRole
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

  @Field(() => UserRole)
  @IsEnum(UserRole)
  role!: UserRole
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
