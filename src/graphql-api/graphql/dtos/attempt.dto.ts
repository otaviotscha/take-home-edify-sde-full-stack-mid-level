import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

@ObjectType()
export class Attempt {
  @Field(() => ID)
  @IsUUID()
  id!: string

  @Field(() => ID)
  @IsUUID()
  learningSessionId!: string

  @Field(() => ID)
  @IsUUID()
  wordId!: string

  @Field()
  @IsBoolean()
  correct!: boolean

  @Field()
  @IsString()
  @IsNotEmpty()
  userAnswer!: string

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  attemptedAt?: Date
}

@ObjectType()
export class SubmitAttemptResponse {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userAnswer?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  correctAnswer?: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  correct?: boolean

  @Field()
  @IsString()
  @IsNotEmpty()
  message!: string

  @Field()
  @IsBoolean()
  sessionFinished!: boolean
}

@InputType()
export class SubmitAttemptInput {
  @Field(() => ID)
  @IsUUID()
  sessionId!: string

  @Field(() => ID)
  @IsUUID()
  wordId!: string

  @Field()
  @IsString()
  @IsNotEmpty()
  userAnswer!: string
}
