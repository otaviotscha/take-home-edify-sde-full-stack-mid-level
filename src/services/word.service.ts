import { Injectable } from '@nestjs/common'
import type { CreateWordInput, UpdateWordInput, WordResponse } from '@/graphql-api/graphql/dtos/word.dto'
import { WordRepository } from '@/repositories/word.repository'

@Injectable()
export class WordService {
  constructor(private readonly wordRepository: WordRepository) {}

  createWord(data: CreateWordInput): Promise<WordResponse | null> {
    return this.wordRepository.createWord(data)
  }

  findWordById(id: string): Promise<WordResponse | null> {
    return this.wordRepository.findWordById(id)
  }

  updateWord(data: UpdateWordInput): Promise<WordResponse> {
    return this.wordRepository.updateWord(data)
  }

  deleteWord(id: string): Promise<WordResponse> {
    return this.wordRepository.deleteWord(id)
  }

  listWordsByVocabularySet(vocabularySetId: string): Promise<WordResponse[]> {
    return this.wordRepository.listWordsByVocabularySet(vocabularySetId)
  }
}
