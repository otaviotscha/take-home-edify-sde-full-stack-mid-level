import '@/graphql-api/graphql/enums/difficulty-level.enum'
import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsDate, IsEnum, IsInt, IsOptional, IsPositive, IsUUID } from 'class-validator'
import { DifficultyLevelEnum } from '@/db/schema'

@ObjectType()
export class LearningSessionResponse {
  @Field(() => ID)
  @IsUUID()
  id!: string

  @Field(() => ID)
  @IsUUID()
  studentId!: string

  @Field(() => ID)
  @IsUUID()
  vocabularySetId!: string

  @Field(() => DifficultyLevelEnum)
  @IsEnum(DifficultyLevelEnum)
  difficulty!: DifficultyLevelEnum

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  maxDurationMs!: number

  @Field(() => Int)
  @IsOptional()
  @IsInt()
  @IsPositive()
  durationMs!: number | null

  @Field()
  @IsDate()
  startedAt!: Date

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  finishedAt!: Date | null

  @Field(() => Int)
  @IsInt()
  score!: number
}

@InputType()
export class StartLearningSessionInput {
  @Field(() => ID)
  @IsUUID()
  vocabularySetId!: string

  @Field(() => DifficultyLevelEnum)
  @IsEnum(DifficultyLevelEnum)
  difficulty!: DifficultyLevelEnum

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
