import { Injectable, NotFoundException } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { type CreateVocabularySet, type UpdateVocabularySet, type VocabularySet, vocabularySets } from '@/db/schema'

@Injectable()
export class VocabularyRepository {
  async createVocabularySet(data: CreateVocabularySet): Promise<VocabularySet | null> {
    const [newSet] = await db.insert(vocabularySets).values(data).returning()
    return newSet ?? null
  }

  async findVocabularySetById(id: string): Promise<VocabularySet | null> {
    const sets = await db.select().from(vocabularySets).where(eq(vocabularySets.id, id)).limit(1)
    if (!sets.length) throw new NotFoundException('Vocabulary set not found')
    return sets[0] ?? null
  }

  async updateVocabularySet(data: UpdateVocabularySet): Promise<VocabularySet> {
    if (!data.id) {
      throw new NotFoundException('No vocabulary set ID provided')
    }

    const [updated] = await db
      .update(vocabularySets)
      .set({ name: data.name, description: data.description ?? null })
      .where(eq(vocabularySets.id, data.id))
      .returning()
    if (!updated) throw new NotFoundException('Vocabulary set not found')
    return updated
  }

  async deleteVocabularySet(id: string): Promise<VocabularySet> {
    const [deleted] = await db.delete(vocabularySets).where(eq(vocabularySets.id, id)).returning()
    if (!deleted) throw new NotFoundException('Vocabulary set not found')
    return deleted
  }

  async listVocabularySets(): Promise<VocabularySet[]> {
    return db.select().from(vocabularySets)
  }
}
