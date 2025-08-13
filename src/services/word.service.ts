import { Injectable } from '@nestjs/common'
import type { CreateWordInput, UpdateWordInput } from '@/graphql-api/graphql/dtos/word.dto'
import { WordRepository } from '@/repositories/word.repository'

@Injectable()
export class WordService {
  constructor(private readonly wordRepository: WordRepository) {}

  createWord(data: CreateWordInput) {
    return this.wordRepository.createWord(data)
  }

  findWordById(id: string) {
    return this.wordRepository.findWordById(id)
  }

  updateWord(data: UpdateWordInput) {
    return this.wordRepository.updateWord(data)
  }

  deleteWord(id: string) {
    return this.wordRepository.deleteWord(id)
  }

  listWordsByVocabularySet(vocabularySetId: string) {
    return this.wordRepository.listWordsByVocabularySet(vocabularySetId)
  }
}
