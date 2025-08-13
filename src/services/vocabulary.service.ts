import { Injectable } from '@nestjs/common'
import type { CreateVocabularySet } from '@/db/schema'
import type { UpdateVocabularySetInput, VocabularySetResponse } from '@/graphql-api/graphql/dtos/vocabulary.dto'
import { VocabularyRepository } from '@/repositories/vocabulary.repository'

@Injectable()
export class VocabularyService {
  constructor(private readonly vocabularyRepository: VocabularyRepository) {}

  createVocabularySet(data: CreateVocabularySet): Promise<VocabularySetResponse | null> {
    return this.vocabularyRepository.createVocabularySet(data)
  }

  findVocabularySetById(id: string): Promise<VocabularySetResponse | null> {
    return this.vocabularyRepository.findVocabularySetById(id)
  }

  updateVocabularySet(data: UpdateVocabularySetInput): Promise<VocabularySetResponse> {
    return this.vocabularyRepository.updateVocabularySet(data)
  }

  deleteVocabularySet(id: string): Promise<VocabularySetResponse> {
    return this.vocabularyRepository.deleteVocabularySet(id)
  }

  listVocabularySets(): Promise<VocabularySetResponse[]> {
    return this.vocabularyRepository.listVocabularySets()
  }
}
