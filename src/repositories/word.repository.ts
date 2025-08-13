import { Injectable, NotFoundException } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { type CreateWord, type UpdateWord, words } from '@/db/schema'

@Injectable()
export class WordRepository {
  async createWord(data: CreateWord) {
    const [newWord] = await db.insert(words).values(data).returning()
    return newWord
  }

  async findWordById(id: string) {
    const word = await db.select().from(words).where(eq(words.id, id)).limit(1)
    if (!word.length) throw new NotFoundException('Word not found')
    return word[0]
  }

  async updateWord(data: UpdateWord) {
    if (!data.id) {
      throw new NotFoundException(`No word ID provided`)
    }

    const [updated] = await db.update(words).set(data).where(eq(words.id, data.id)).returning()
    if (!updated) throw new NotFoundException('Word not found')
    return updated
  }

  async deleteWord(id: string) {
    const [deleted] = await db.delete(words).where(eq(words.id, id)).returning()
    if (!deleted) throw new NotFoundException('Word not found')
    return deleted
  }

  async listWordsByVocabularySet(vocabularySetId: string) {
    return db.select().from(words).where(eq(words.vocabularySetId, vocabularySetId))
  }
}
