import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

@ObjectType()
export class Token {
  @Field()
  @IsString()
  @IsNotEmpty()
  accessToken!: string
}

@InputType()
export class LoginInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @Field()
  @IsString()
  @MinLength(8)
  password!: string
}
