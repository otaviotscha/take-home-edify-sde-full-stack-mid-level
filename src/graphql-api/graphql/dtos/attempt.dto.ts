import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

@ObjectType()
export class AttemptResponse {
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
  attemptedAt!: Date | null
}

@ObjectType()
export class SubmitAttemptSuccessResponse {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  userAnswer!: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  correctAnswer!: string

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  correct!: boolean

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message!: string | null

  @Field()
  @IsBoolean()
  sessionFinished!: boolean
}

@ObjectType()
export class SubmitAttemptFailureResponse {
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
