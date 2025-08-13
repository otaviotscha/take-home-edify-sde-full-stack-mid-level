import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { DifficultyLevelEnum } from '@/db/schema'

@ObjectType()
export class VocabularySetResponse {
  @Field(() => ID)
  @IsUUID()
  id!: string

  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description!: string | null

  @Field(() => DifficultyLevelEnum)
  @IsEnum(DifficultyLevelEnum)
  difficulty!: DifficultyLevelEnum

  @Field()
  @IsDate()
  createdAt!: Date

  @Field()
  @IsString()
  @IsNotEmpty()
  createdBy!: string
}

@InputType()
export class CreateVocabularySetInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  description!: string | null

  @Field(() => DifficultyLevelEnum)
  @IsEnum(DifficultyLevelEnum)
  difficulty!: DifficultyLevelEnum
}

@InputType()
export class UpdateVocabularySetInput {
  @Field(() => ID)
  @IsUUID()
  id!: string

  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  description?: string
}
