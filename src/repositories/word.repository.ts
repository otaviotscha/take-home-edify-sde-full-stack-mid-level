import { Injectable, NotFoundException } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { type CreateWord, type UpdateWord, type Word, words } from '@/db/schema'

@Injectable()
export class WordRepository {
  async createWord(data: CreateWord): Promise<Word | null> {
    const [newWord] = await db.insert(words).values(data).returning()
    return newWord ?? null
  }

  async findWordById(id: string): Promise<Word | null> {
    const word = await db.select().from(words).where(eq(words.id, id)).limit(1)
    if (!word.length) throw new NotFoundException('Word not found')
    return word[0] ?? null
  }

  async updateWord(data: UpdateWord): Promise<Word> {
    if (!data.id) {
      throw new NotFoundException(`No word ID provided`)
    }

    const [updated] = await db.update(words).set(data).where(eq(words.id, data.id)).returning()
    if (!updated) throw new NotFoundException('Word not found')
    return updated
  }

  async deleteWord(id: string): Promise<Word> {
    const [deleted] = await db.delete(words).where(eq(words.id, id)).returning()
    if (!deleted) throw new NotFoundException('Word not found')
    return deleted
  }

  async listWordsByVocabularySet(vocabularySetId: string): Promise<Word[]> {
    return db.select().from(words).where(eq(words.vocabularySetId, vocabularySetId))
  }
}
