import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import type { User } from '@/db/schema'
import { CurrentUser } from '@/graphql-api/decorators/current-user.decorator'
import {
  CreateVocabularySetInput,
  UpdateVocabularySetInput,
  VocabularySet,
} from '@/graphql-api/graphql/dtos/vocabulary.dto'
import { Word } from '@/graphql-api/graphql/dtos/word.dto'
import { GqlAuthRolesGuard } from '@/graphql-api/guards/gql-auth-roles.guard'
import { VocabularyService } from '@/services/vocabulary.service'
import { WordService } from '@/services/word.service'

@Resolver(() => VocabularySet)
export class VocabularyResolver {
  constructor(
    private readonly vocabularyService: VocabularyService,
    private readonly wordService: WordService
  ) {}

  @Query(() => [VocabularySet])
  @UseGuards(GqlAuthRolesGuard)
  listVocabularySets() {
    return this.vocabularyService.listVocabularySets()
  }

  @Query(() => VocabularySet)
  @UseGuards(GqlAuthRolesGuard)
  findVocabularySet(@Args('id') id: string) {
    return this.vocabularyService.findVocabularySetById(id)
  }

  @Mutation(() => VocabularySet)
  @UseGuards(GqlAuthRolesGuard)
  createVocabularySet(@Args('input') input: CreateVocabularySetInput, @CurrentUser() user: User) {
    return this.vocabularyService.createVocabularySet({ ...input, createdBy: user.id })
  }

  @Mutation(() => VocabularySet)
  @UseGuards(GqlAuthRolesGuard)
  updateVocabularySet(@Args('input') input: UpdateVocabularySetInput) {
    return this.vocabularyService.updateVocabularySet(input)
  }

  @Mutation(() => VocabularySet)
  @UseGuards(GqlAuthRolesGuard)
  deleteVocabularySet(@Args('id') id: string) {
    return this.vocabularyService.deleteVocabularySet(id)
  }

  @ResolveField(() => [Word])
  async words(@Parent() vocabSet: VocabularySet) {
    return this.wordService.listWordsByVocabularySet(vocabSet.id)
  }
}
