import { Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { attempts, type CreateAttempt } from '@/db/schema'

@Injectable()
export class AttemptRepository {
  async createAttempt(data: CreateAttempt) {
    const [attempt] = await db.insert(attempts).values(data).returning()
    return attempt
  }

  async listAttemptsForSession(sessionId: string) {
    return db.select().from(attempts).where(eq(attempts.learningSessionId, sessionId))
  }

  async listAttemptsForSessionAndWord(sessionId: string, wordId: string) {
    return db
      .select()
      .from(attempts)
      .where(and(eq(attempts.learningSessionId, sessionId), eq(attempts.wordId, wordId)))
  }
}
