import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import type { User } from '@/db/schema'
import { CurrentUser } from '@/graphql-api/decorators/current-user.decorator'
import {
  CreateVocabularySetInput,
  UpdateVocabularySetInput,
  VocabularySetResponse,
} from '@/graphql-api/graphql/dtos/vocabulary.dto'
import { WordResponse } from '@/graphql-api/graphql/dtos/word.dto'
import { AdminGuard } from '@/graphql-api/graphql/guards/admin.guard'
import { GqlAuthRolesGuard } from '@/graphql-api/graphql/guards/gql-auth-roles.guard'
import { VocabularyService } from '@/services/vocabulary.service'
import { WordService } from '@/services/word.service'

@Resolver(() => VocabularySetResponse)
export class VocabularyResolver {
  constructor(
    private readonly vocabularyService: VocabularyService,
    private readonly wordService: WordService
  ) {}

  @Query(() => [VocabularySetResponse])
  @UseGuards(GqlAuthRolesGuard)
  listVocabularySets() {
    return this.vocabularyService.listVocabularySets()
  }

  @Query(() => VocabularySetResponse)
  @UseGuards(GqlAuthRolesGuard)
  findVocabularySet(@Args('id') id: string) {
    return this.vocabularyService.findVocabularySetById(id)
  }

  @Mutation(() => VocabularySetResponse)
  @UseGuards(GqlAuthRolesGuard, AdminGuard)
  createVocabularySet(@Args('input') input: CreateVocabularySetInput, @CurrentUser() user: User) {
    return this.vocabularyService.createVocabularySet({ ...input, createdBy: user.id })
  }

  @Mutation(() => VocabularySetResponse)
  @UseGuards(GqlAuthRolesGuard, AdminGuard)
  updateVocabularySet(@Args('input') input: UpdateVocabularySetInput) {
    return this.vocabularyService.updateVocabularySet(input)
  }

  @Mutation(() => VocabularySetResponse)
  @UseGuards(GqlAuthRolesGuard, AdminGuard)
  deleteVocabularySet(@Args('id') id: string) {
    return this.vocabularyService.deleteVocabularySet(id)
  }

  @ResolveField(() => [WordResponse])
  async words(@Parent() vocabSet: VocabularySetResponse) {
    return this.wordService.listWordsByVocabularySet(vocabSet.id)
  }
}
