import { Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
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
}
