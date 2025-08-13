import { Injectable, NotFoundException } from '@nestjs/common'
import type { SubmitAttemptFailureResponse, SubmitAttemptSuccessResponse } from '@/graphql-api/graphql/dtos/attempt.dto'
import type {
  FinishLearningSessionInput,
  LearningSessionResponse,
  StartLearningSessionInput,
} from '@/graphql-api/graphql/dtos/learning-session.dto'
import type { WordResponse } from '@/graphql-api/graphql/dtos/word.dto'
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

  async startSession(data: StartLearningSessionInput, studentId: string): Promise<LearningSessionResponse | null> {
    return this.sessionRepo.startSession({ ...data, studentId })
  }

  async finishSession(data: FinishLearningSessionInput): Promise<LearningSessionResponse> {
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

  async getSessionById(sessionId: string): Promise<LearningSessionResponse> {
    return this.sessionRepo.findSessionById(sessionId)
  }

  async listSessionsByStudent(studentId: string): Promise<LearningSessionResponse[]> {
    return this.sessionRepo.listSessionsByStudent(studentId)
  }

  async getNextWordForSession(sessionId: string): Promise<WordResponse | null> {
    return this.sessionRepo.getNextWordForSession(sessionId)
  }

  async submitAttempt(
    sessionId: string,
    wordId: string,
    userAnswer: string
  ): Promise<SubmitAttemptSuccessResponse | SubmitAttemptFailureResponse> {
    const now = new Date()

    const session = await this.sessionRepo.findSessionById(sessionId)
    if (!session) {
      throw new NotFoundException(`Learning session with ID ${sessionId} not found.`)
    }

    if (session.finishedAt) {
      return {
        message: 'Session already finished.',
        sessionFinished: true,
      }
    }

    const sessionStartedAt = session.startedAt
    const sessionDurationMs = session.maxDurationMs
    const sessionExpiresAt = new Date(sessionStartedAt.getTime() + sessionDurationMs)

    if (now > sessionExpiresAt) {
      // Session has expired
      await this.finishSession({ sessionId })
      return {
        message: 'Session expired and finished.',
        sessionFinished: true,
      }
    }

    const alreadyAttemped = await this.attemptRepo.listAttemptsForSessionAndWord(sessionId, wordId)
    if (alreadyAttemped.length) {
      return {
        message: 'Word already answered.',
        sessionFinished: false,
      }
    }
    const word = await this.sessionRepo.getWordById(wordId)
    const correct = word.term.toLowerCase() === userAnswer.trim().toLowerCase()
    const attempt = await this.attemptRepo.createAttempt({ learningSessionId: sessionId, wordId, correct, userAnswer })

    const nextWord = await this.getNextWordForSession(sessionId)
    if (!nextWord) {
      await this.finishSession({ sessionId })
      return {
        userAnswer: attempt?.userAnswer,
        correctAnswer: word.term,
        correct,
        message: 'No next word. Session finished.',
        sessionFinished: true,
      }
    }

    return {
      userAnswer: attempt?.userAnswer,
      correctAnswer: word.term,
      correct,
      message: 'Attempt submitted successfully.',
      sessionFinished: false,
    }
  }
}
