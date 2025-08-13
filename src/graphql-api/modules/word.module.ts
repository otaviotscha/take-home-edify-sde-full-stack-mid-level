import { Module } from '@nestjs/common'
import { WordResolver } from '@/graphql-api/graphql/resolvers/word.resolver'
import { WordRepository } from '@/repositories/word.repository'
import { WordService } from '@/services/word.service'

@Module({
  providers: [WordResolver, WordService, WordRepository],
  exports: [WordService],
})
export class WordModule {}
