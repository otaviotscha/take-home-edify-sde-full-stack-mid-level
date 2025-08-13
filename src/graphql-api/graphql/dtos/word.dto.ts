import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

@ObjectType()
export class WordResponse {
  @Field(() => ID)
  @IsUUID()
  id!: string

  @Field(() => ID)
  @IsUUID()
  vocabularySetId!: string

  @Field()
  @IsString()
  @IsNotEmpty()
  term!: string

  @Field()
  @IsString()
  @IsNotEmpty()
  definition!: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  exampleSentence!: string | null
}

@InputType()
export class CreateWordInput {
  @Field(() => ID)
  @IsUUID()
  vocabularySetId!: string

  @Field()
  @IsString()
  @IsNotEmpty()
  term!: string

  @Field()
  @IsString()
  @IsNotEmpty()
  definition!: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  exampleSentence!: string | null
}

@InputType()
export class UpdateWordInput {
  @Field(() => ID)
  @IsUUID()
  id!: string

  @Field()
  @IsString()
  @IsNotEmpty()
  term!: string

  @Field()
  @IsString()
  @IsNotEmpty()
  definition!: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  exampleSentence!: string | null
}
