import { Injectable, NotFoundException } from '@nestjs/common'
import type {
  FinishLearningSessionInput,
  StartLearningSessionInput,
} from '@/graphql-api/graphql/dtos/learning-session.dto'
import { AttemptRepository } from '@/repositories/attempt.repository'
import { LearningSessionRepository } from '@/repositories/learning-session.repository'
import { WordRepository } from '@/repositories/word.repository'

@Injectable()
export class LearningSessionService {
  constructor(
    private readonly sessionRepo: LearningSessionRepository,
    private readonly attemptRepo: AttemptRepository,
    private readonly wordRepo: WordRepository
  ) {}

  async startSession(data: StartLearningSessionInput, studentId: string) {
    return this.sessionRepo.startSession({ ...data, studentId })
  }

  async finishSession(data: FinishLearningSessionInput) {
    const session = await this.sessionRepo.findSessionById(data.sessionId)
    if (!session) {
      throw new NotFoundException(`Learning session with ID ${data.sessionId} not found.`)
    }

    if (session.finishedAt) {
      // Session already finished, no need to re-process
      return session
    }

    const allWordsInSet = await this.wordRepo.listWordsByVocabularySet(session.vocabularySetId)
    const existingAttempts = await this.attemptRepo.listAttemptsForSession(session.id)
    const attemptedWordIds = new Set(existingAttempts.map((a) => a.wordId))

    const unattemptedWords = allWordsInSet.filter((word) => !attemptedWordIds.has(word.id))

    for (const word of unattemptedWords) {
      await this.attemptRepo.createAttempt({
        learningSessionId: session.id,
        wordId: word.id,
        correct: false,
        userAnswer: '',
        attemptedAt: null,
      })
    }

    const updatedAttempts = await this.attemptRepo.listAttemptsForSession(data.sessionId)
    const total = updatedAttempts.length
    const correctCount = updatedAttempts.filter((a) => a.correct).length
    const score = total ? Math.round((correctCount / total) * 100) : 0
    return this.sessionRepo.finishSession(data.sessionId, score)
  }

  async getSessionById(sessionId: string) {
    return this.sessionRepo.findSessionById(sessionId)
  }

  async listSessionsByStudent(studentId: string) {
    return this.sessionRepo.listSessionsByStudent(studentId)
  }

  async getNextWordForSession(sessionId: string) {
    return this.sessionRepo.getNextWordForSession(sessionId)
  }

  async submitAttempt(sessionId: string, wordId: string, userAnswer: string) {
    const now = new Date()

    const session = await this.sessionRepo.findSessionById(sessionId)
    if (!session) {
      throw new NotFoundException(`Learning session with ID ${sessionId} not found.`)
    }

    if (session.finishedAt) {
      return {
        attempt: null,
        correct: false,
        message: 'Session already finished.',
        sessionFinished: true,
      }
    }

    const sessionStartedAt = session.startedAt
    const sessionDurationMs = session.durationMinutes * 60 * 1000 // Convert minutes to milliseconds
    const sessionExpiresAt = new Date(sessionStartedAt.getTime() + sessionDurationMs)

    if (now > sessionExpiresAt) {
      // Session has expired
      await this.finishSession({ sessionId }) // Finish the session
      return {
        attempt: null,
        correct: false,
        message: 'Session expired and finished.',
        sessionFinished: true,
      }
    }

    const word = await this.sessionRepo.getWordById(wordId)
    const correct = word.term.toLowerCase() === userAnswer.trim().toLowerCase()
    const attempt = await this.attemptRepo.createAttempt({ learningSessionId: sessionId, wordId, correct, userAnswer })
    return { ...attempt, correct, message: 'Attempt submitted successfully.', sessionFinished: false }
  }
}
