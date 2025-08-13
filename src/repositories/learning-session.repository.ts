import { Injectable, NotFoundException } from '@nestjs/common'
import { and, eq, notInArray } from 'drizzle-orm'
import { db } from '@/db'
import { attempts, type CreateLearningSession, learningSessions, words } from '@/db/schema'

@Injectable()
export class LearningSessionRepository {
  async startSession(data: CreateLearningSession) {
    const [session] = await db.insert(learningSessions).values(data).returning()
    return session
  }

  async finishSession(sessionId: string, score: number) {
    const finishedAt = new Date()
    const foundSession = await this.findSessionById(sessionId)
    const durationMinutes = Math.round((finishedAt.getTime() - foundSession.startedAt.getTime()) / 1000 / 60)

    const [session] = await db
      .update(learningSessions)
      .set({ finishedAt, durationMinutes, score })
      .where(eq(learningSessions.id, sessionId))
      .returning()
    if (!session) throw new NotFoundException('Learning session not found')
    return session
  }

  async findSessionById(sessionId: string) {
    const session = await db
      .select()
      .from(learningSessions)
      .where(eq(learningSessions.id, sessionId))
      .limit(1)
      .then((rows) => (rows.length ? rows[0] : null))
    if (!session) throw new NotFoundException('Learning session not found')
    return session
  }

  async listSessionsByStudent(studentId: string) {
    return db.select().from(learningSessions).where(eq(learningSessions.studentId, studentId))
  }

  async getNextWordForSession(sessionId: string) {
    const session = await this.findSessionById(sessionId)
    if (!session) {
      throw new NotFoundException('Learning session not found')
    }

    const attemptedWordIds = (
      await db.select({ wordId: attempts.wordId }).from(attempts).where(eq(attempts.learningSessionId, sessionId))
    ).map((a) => a.wordId)

    const candidates = await db
      .select()
      .from(words)
      .where(
        and(
          eq(words.vocabularySetId, session.vocabularySetId),
          notInArray(words.id, attemptedWordIds.length ? attemptedWordIds : [''])
        )
      )
      .limit(1)

    return candidates.length ? candidates[0] : null
  }

  async getWordById(wordId: string) {
    const word = await db
      .select()
      .from(words)
      .where(eq(words.id, wordId))
      .limit(1)
      .then((rows) => (rows.length ? rows[0] : null))
    if (!word) throw new NotFoundException('Word not found')
    return word
  }
}
