import { Injectable } from '@nestjs/common'
import type { CreateVocabularySet } from '@/db/schema'
import type { UpdateVocabularySetInput } from '@/graphql-api/graphql/dtos/vocabulary.dto'
import { VocabularyRepository } from '@/repositories/vocabulary.repository'

@Injectable()
export class VocabularyService {
  constructor(private readonly vocabularyRepository: VocabularyRepository) {}

  createVocabularySet(data: CreateVocabularySet) {
    return this.vocabularyRepository.createVocabularySet(data)
  }

  findVocabularySetById(id: string) {
    return this.vocabularyRepository.findVocabularySetById(id)
  }

  updateVocabularySet(data: UpdateVocabularySetInput) {
    return this.vocabularyRepository.updateVocabularySet(data)
  }

  deleteVocabularySet(id: string) {
    return this.vocabularyRepository.deleteVocabularySet(id)
  }

  listVocabularySets() {
    return this.vocabularyRepository.listVocabularySets()
  }
}
