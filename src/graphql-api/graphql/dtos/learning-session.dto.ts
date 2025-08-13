import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsDate, IsEnum, IsInt, IsOptional, IsPositive, IsUUID } from 'class-validator'
import { DifficultyLevel } from '@/graphql-api/graphql/enums/difficulty-level.enum'

@ObjectType()
export class LearningSession {
  @Field(() => ID)
  @IsUUID()
  id!: string

  @Field(() => ID)
  @IsUUID()
  studentId!: string

  @Field(() => ID)
  @IsUUID()
  vocabularySetId!: string

  @Field(() => DifficultyLevel)
  @IsEnum(DifficultyLevel)
  difficulty!: DifficultyLevel

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  maxDurationMs!: number

  @Field(() => Int)
  @IsOptional()
  @IsInt()
  @IsPositive()
  durationMs?: number

  @Field()
  @IsDate()
  startedAt!: Date

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  finishedAt?: Date

  @Field(() => Int)
  @IsInt()
  score!: number
}

@InputType()
export class StartLearningSessionInput {
  @Field(() => ID)
  @IsUUID()
  vocabularySetId!: string

  @Field(() => DifficultyLevel)
  @IsEnum(DifficultyLevel)
  difficulty!: DifficultyLevel

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  maxDurationMs!: number
}

@InputType()
export class FinishLearningSessionInput {
  @Field(() => ID)
  @IsUUID()
  sessionId!: string
}
