import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Token {
  @Field()
  accessToken!: string
}

@InputType()
export class LoginInput {
  @Field()
  email!: string

  @Field()
  password!: string
}
