import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateWordInput, UpdateWordInput, WordResponse } from '@/graphql-api/graphql/dtos/word.dto'
import { AdminGuard } from '@/graphql-api/graphql/guards/admin.guard'
import { GqlAuthRolesGuard } from '@/graphql-api/graphql/guards/gql-auth-roles.guard'
import { WordService } from '@/services/word.service'

@Resolver(() => WordResponse)
export class WordResolver {
  constructor(private readonly wordService: WordService) {}

  @Query(() => [WordResponse])
  @UseGuards(GqlAuthRolesGuard)
  listWords(@Args('vocabularySetId') vocabularySetId: string) {
    return this.wordService.listWordsByVocabularySet(vocabularySetId)
  }

  @Query(() => WordResponse)
  @UseGuards(GqlAuthRolesGuard)
  findWord(@Args('id') id: string) {
    return this.wordService.findWordById(id)
  }

  @Mutation(() => WordResponse)
  @UseGuards(GqlAuthRolesGuard, AdminGuard)
  createWord(@Args('input') input: CreateWordInput) {
    return this.wordService.createWord(input)
  }

  @Mutation(() => WordResponse)
  @UseGuards(GqlAuthRolesGuard, AdminGuard)
  updateWord(@Args('input') input: UpdateWordInput) {
    return this.wordService.updateWord(input)
  }

  @Mutation(() => WordResponse)
  @UseGuards(GqlAuthRolesGuard, AdminGuard)
  deleteWord(@Args('id') id: string) {
    return this.wordService.deleteWord(id)
  }
}
