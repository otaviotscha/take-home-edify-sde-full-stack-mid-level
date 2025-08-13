import { Injectable, NotFoundException } from '@nestjs/common'
import { and, eq, notInArray } from 'drizzle-orm'
import { db } from '@/db'
import {
  attempts,
  type CreateLearningSession,
  type LearningSession,
  learningSessions,
  vocabularySets,
  type Word,
  words,
} from '@/db/schema'

@Injectable()
export class LearningSessionRepository {
  async startSession(data: CreateLearningSession): Promise<LearningSession | null> {
    const vocabularySet = await db
      .select()
      .from(vocabularySets)
      .where(eq(vocabularySets.difficulty, data.difficulty))
      .limit(1)
      .then((rows) => (rows.length ? rows[0] : null))

    if (!vocabularySet) throw new NotFoundException(`No vocabulary set for the difficulty ${data.difficulty}`)
    const [session] = await db.insert(learningSessions).values(data).returning()
    return session ?? null
  }

  async finishSession(sessionId: string, score: number): Promise<LearningSession> {
    const finishedAt = new Date()
    const foundSession = await this.findSessionById(sessionId)
    const calculatedDurationMs = Math.round(finishedAt.getTime() - foundSession.startedAt.getTime())
    const durationMs =
      calculatedDurationMs > foundSession.maxDurationMs ? foundSession.maxDurationMs : calculatedDurationMs

    const [session] = await db
      .update(learningSessions)
      .set({ finishedAt, durationMs, score })
      .where(eq(learningSessions.id, sessionId))
      .returning()
    if (!session) throw new NotFoundException('Learning session not found')
    return session
  }

  async findSessionById(sessionId: string): Promise<LearningSession> {
    const session = await db
      .select()
      .from(learningSessions)
      .where(eq(learningSessions.id, sessionId))
      .limit(1)
      .then((rows) => (rows.length ? rows[0] : null))
    if (!session) throw new NotFoundException('Learning session not found')
    return session
  }

  async listSessionsByStudent(studentId: string): Promise<LearningSession[]> {
    return db.select().from(learningSessions).where(eq(learningSessions.studentId, studentId)) ?? null
  }

  async getNextWordForSession(sessionId: string): Promise<Word | null> {
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
      .where(and(eq(words.vocabularySetId, session.vocabularySetId), notInArray(words.id, attemptedWordIds)))
      .limit(1)

    return candidates.length ? (candidates[0] ?? null) : null
  }

  async getWordById(wordId: string): Promise<Word> {
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
