import { Module } from '@nestjs/common'
import { VocabularyResolver } from '@/graphql-api/graphql/resolvers/vocabulary.resolver'
import { WordModule } from '@/graphql-api/modules/word.module'
import { VocabularyRepository } from '@/repositories/vocabulary.repository'
import { VocabularyService } from '@/services/vocabulary.service'

@Module({
  imports: [WordModule],
  providers: [VocabularyResolver, VocabularyService, VocabularyRepository],
  exports: [VocabularyService],
})
export class VocabularyModule {}
