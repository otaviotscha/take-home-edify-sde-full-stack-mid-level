import { Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { type Attempt, attempts, type CreateAttempt } from '@/db/schema'

@Injectable()
export class AttemptRepository {
  async createAttempt(data: CreateAttempt): Promise<Attempt | null> {
    const [attempt] = await db.insert(attempts).values(data).returning()
    return attempt ?? null
  }

  async listAttemptsForSession(sessionId: string): Promise<Attempt[]> {
    return db.select().from(attempts).where(eq(attempts.learningSessionId, sessionId))
  }

  async listAttemptsForSessionAndWord(sessionId: string, wordId: string): Promise<Attempt[]> {
    return db
      .select()
      .from(attempts)
      .where(and(eq(attempts.learningSessionId, sessionId), eq(attempts.wordId, wordId)))
  }
}
