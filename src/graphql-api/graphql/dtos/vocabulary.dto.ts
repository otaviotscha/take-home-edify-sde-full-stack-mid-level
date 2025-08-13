import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { DifficultyLevel } from '@/graphql-api/graphql/enums/difficulty-level.enum'

@ObjectType()
export class VocabularySet {
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
  description?: string

  @Field(() => DifficultyLevel)
  @IsEnum(DifficultyLevel)
  difficulty!: DifficultyLevel

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
  description?: string

  @Field(() => DifficultyLevel)
  @IsEnum(DifficultyLevel)
  difficulty!: DifficultyLevel
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
