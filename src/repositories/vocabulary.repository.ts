import { Injectable, NotFoundException } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { type CreateVocabularySet, type UpdateVocabularySet, vocabularySets } from '@/db/schema'

@Injectable()
export class VocabularyRepository {
  async createVocabularySet(data: CreateVocabularySet) {
    const [newSet] = await db.insert(vocabularySets).values(data).returning()
    return newSet
  }

  async findVocabularySetById(id: string) {
    const sets = await db.select().from(vocabularySets).where(eq(vocabularySets.id, id)).limit(1)
    if (!sets.length) throw new NotFoundException('Vocabulary set not found')
    return sets[0]
  }

  async updateVocabularySet(data: UpdateVocabularySet) {
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

  async deleteVocabularySet(id: string) {
    const [deleted] = await db.delete(vocabularySets).where(eq(vocabularySets.id, id)).returning()
    if (!deleted) throw new NotFoundException('Vocabulary set not found')
    return deleted
  }

  async listVocabularySets() {
    return db.select().from(vocabularySets)
  }
}
