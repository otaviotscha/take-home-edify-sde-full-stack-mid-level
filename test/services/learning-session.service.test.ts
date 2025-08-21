import { beforeEach, describe, expect, mock, test } from 'bun:test'
import { NotFoundException } from '@nestjs/common'
import { DifficultyLevelEnum } from '@/db/schema'
import { AttemptRepository } from '@/repositories/attempt.repository'
import { LearningSessionRepository } from '@/repositories/learning-session.repository'
import { WordRepository } from '@/repositories/word.repository'
import { LearningSessionService } from '@/services/learning-session.service'

const baseSession = {
  id: 'session1',
  vocabularySetId: 'vocab1',
  studentId: 'student1',
  difficulty: DifficultyLevelEnum.A1,
  maxDurationMs: 60000,
  durationMs: null,
  startedAt: new Date(),
  finishedAt: null,
  score: 0,
}

const baseWord = {
  id: 'word1',
  vocabularySetId: 'vocab1',
  term: 'apple',
  definition: 'fruit',
  exampleSentence: 'An apple a day...',
  difficultyLevel: DifficultyLevelEnum.A1,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('LearningSessionService', () => {
  let learningSessionService: LearningSessionService
  let sessionRepo: LearningSessionRepository
  let attemptRepo: AttemptRepository
  let wordRepo: WordRepository

  beforeEach(() => {
    sessionRepo = {
      startSession: mock(() => Promise.resolve(null)),
      findSessionById: mock(() => Promise.resolve(null)),
      listSessionsByStudent: mock(() => Promise.resolve([])),
      getNextWordForSession: mock(() => Promise.resolve(null)),
      finishSession: mock(() => Promise.resolve(null)),
      getWordById: mock(() => Promise.resolve(null)),
    } as unknown as LearningSessionRepository

    attemptRepo = {
      createAttempt: mock(() => Promise.resolve(null)),
      listAttemptsForSession: mock(() => Promise.resolve([])),
      listAttemptsForSessionAndWord: mock(() => Promise.resolve([])),
    } as unknown as AttemptRepository

    wordRepo = {
      listWordsByVocabularySet: mock(() => Promise.resolve([])),
    } as unknown as WordRepository

    learningSessionService = new LearningSessionService(sessionRepo, attemptRepo, wordRepo)
  })

  test('should be defined', () => {
    expect(learningSessionService).toBeDefined()
  })

  describe('startSession', () => {
    test('calls repo and returns result', async () => {
      ;(sessionRepo.startSession as ReturnType<typeof mock>).mockResolvedValue(baseSession)
      const result = await learningSessionService.startSession(
        { vocabularySetId: baseSession.vocabularySetId, maxDurationMs: 60000, difficulty: DifficultyLevelEnum.A1 },
        baseSession.studentId
      )

      expect(sessionRepo.startSession).toHaveBeenCalledWith({
        vocabularySetId: baseSession.vocabularySetId,
        maxDurationMs: 60000,
        difficulty: DifficultyLevelEnum.A1,
        studentId: baseSession.studentId,
      })
      expect(result).toEqual(baseSession)
    })
  })

  describe('getSessionById', () => {
    test('should call sessionRepo.findSessionById and return its result', async () => {
      ;(sessionRepo.findSessionById as ReturnType<typeof mock>).mockResolvedValue(baseSession)
      const result = await learningSessionService.getSessionById(baseSession.id)
      expect(sessionRepo.findSessionById).toHaveBeenCalledWith(baseSession.id)
      expect(result).toEqual(baseSession)
    })
  })

  describe('listSessionsByStudent', () => {
    test('should call sessionRepo.listSessionsByStudent and return its result', async () => {
      ;(sessionRepo.listSessionsByStudent as ReturnType<typeof mock>).mockResolvedValue([baseSession])

      const result = await learningSessionService.listSessionsByStudent(baseSession.studentId)
      expect(sessionRepo.listSessionsByStudent).toHaveBeenCalledWith(baseSession.studentId)
      expect(result).toEqual([baseSession])
    })
  })

  describe('getNextWordForSession', () => {
    test('should call sessionRepo.getNextWordForSession and return its result', async () => {
      ;(sessionRepo.getNextWordForSession as ReturnType<typeof mock>).mockResolvedValue(baseWord)

      const result = await learningSessionService.getNextWordForSession(baseSession.id)
      expect(sessionRepo.getNextWordForSession).toHaveBeenCalledWith(baseSession.id)
      expect(result).toEqual(baseWord)
    })
  })

  describe('finishSession', () => {
    test('should throw NotFoundException if session is not found', async () => {
      ;(sessionRepo.findSessionById as ReturnType<typeof mock>).mockResolvedValue(null)

      expect(learningSessionService.finishSession({ sessionId: baseSession.id })).rejects.toThrow(
        new NotFoundException(`Learning session with ID ${baseSession.id} not found.`)
      )
      expect(sessionRepo.findSessionById).toHaveBeenCalledWith(baseSession.id)
    })

    test('should return session if already finished', async () => {
      const finishedSession = { ...baseSession, finishedAt: new Date() }
      ;(sessionRepo.findSessionById as ReturnType<typeof mock>).mockResolvedValue(finishedSession)

      const result = await learningSessionService.finishSession({ sessionId: finishedSession.id })
      expect(result).toEqual(finishedSession)
      expect(sessionRepo.findSessionById).toHaveBeenCalledWith(finishedSession.id)
      expect(wordRepo.listWordsByVocabularySet).not.toHaveBeenCalled()
      expect(attemptRepo.listAttemptsForSession).not.toHaveBeenCalled()
      expect(sessionRepo.finishSession).not.toHaveBeenCalled()
    })

    test('should create attempts for unattempted words and finish session', async () => {
      const baseWords = [
        baseWord,
        {
          id: 'word2',
          vocabularySetId: baseSession.vocabularySetId,
          term: 'b',
          definition: 'B',
          exampleSentence: 'Ex B',
          difficultyLevel: DifficultyLevelEnum.A1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'word3',
          vocabularySetId: baseSession.vocabularySetId,
          term: 'c',
          definition: 'C',
          exampleSentence: 'Ex C',
          difficultyLevel: DifficultyLevelEnum.A1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      const mockExistingAttempts = [
        {
          id: 'att1',
          learningSessionId: baseSession.id,
          wordId: 'word1',
          correct: true,
          userAnswer: 'a',
          attemptedAt: new Date(),
        },
      ]
      const mockUpdatedAttempts = [
        ...mockExistingAttempts,
        {
          id: 'att2',
          learningSessionId: baseSession.id,
          wordId: 'word2',
          correct: false,
          userAnswer: '',
          attemptedAt: null,
        },
        {
          id: 'att3',
          learningSessionId: baseSession.id,
          wordId: 'word3',
          correct: false,
          userAnswer: '',
          attemptedAt: null,
        },
      ]
      const expectedScore = Math.round((1 / 3) * 100) // 1 out of 3 correct

      ;(sessionRepo.findSessionById as ReturnType<typeof mock>).mockResolvedValue(baseSession)
      ;(wordRepo.listWordsByVocabularySet as ReturnType<typeof mock>).mockResolvedValue(baseWords)
      ;(attemptRepo.listAttemptsForSession as ReturnType<typeof mock>)
        .mockResolvedValueOnce(mockExistingAttempts) // For initial check
        .mockResolvedValueOnce(mockUpdatedAttempts) // For score calculation
      ;(attemptRepo.createAttempt as ReturnType<typeof mock>).mockImplementation((attempt) => Promise.resolve(attempt))
      ;(sessionRepo.finishSession as ReturnType<typeof mock>).mockResolvedValue({
        ...baseSession,
        finishedAt: new Date(),
        score: expectedScore,
      })

      const result = await learningSessionService.finishSession({ sessionId: baseSession.id })

      expect(sessionRepo.findSessionById).toHaveBeenCalledWith(baseSession.id)
      expect(wordRepo.listWordsByVocabularySet).toHaveBeenCalledWith(baseSession.vocabularySetId)
      expect(attemptRepo.listAttemptsForSession).toHaveBeenCalledWith(baseSession.id)
      expect(attemptRepo.createAttempt).toHaveBeenCalledTimes(2) // word2 and word3
      expect(attemptRepo.createAttempt).toHaveBeenCalledWith({
        learningSessionId: baseSession.id,
        wordId: 'word2',
        correct: false,
        userAnswer: '',
        attemptedAt: null,
      })
      expect(attemptRepo.createAttempt).toHaveBeenCalledWith({
        learningSessionId: baseSession.id,
        wordId: 'word3',
        correct: false,
        userAnswer: '',
        attemptedAt: null,
      })
      expect(sessionRepo.finishSession).toHaveBeenCalledWith(baseSession.id, expectedScore)
      expect(result.score).toBe(expectedScore)
      expect(result.finishedAt).toBeInstanceOf(Date)
    })
  })

  describe('submitAttempt', () => {
    test('should throw NotFoundException if session is not found', async () => {
      const sessionId = 'nonexistentSession'
      ;(sessionRepo.findSessionById as ReturnType<typeof mock>).mockResolvedValue(null)

      await expect(learningSessionService.submitAttempt(sessionId, 'word1', 'answer')).rejects.toThrow(
        new NotFoundException(`Learning session with ID ${sessionId} not found.`)
      )
      expect(sessionRepo.findSessionById).toHaveBeenCalledWith(sessionId)
    })

    test('should return sessionFinished: true if session is already finished', async () => {
      const mockSession = { ...baseSession, startedAt: new Date(), finishedAt: new Date() }
      ;(sessionRepo.findSessionById as ReturnType<typeof mock>).mockResolvedValue(mockSession)

      const result = await learningSessionService.submitAttempt('session1', 'word1', 'answer')
      expect(result).toEqual({ message: 'Session already finished.', sessionFinished: true })
      expect(sessionRepo.findSessionById).toHaveBeenCalledWith('session1')
    })

    test('should finish session and return sessionFinished: true if session expired', async () => {
      const startedAt = new Date(Date.now() - 70000) // Started 70 seconds ago
      const mockSession = { ...baseSession, startedAt, finishedAt: null }
      ;(sessionRepo.findSessionById as ReturnType<typeof mock>).mockResolvedValue(mockSession)
      ;(sessionRepo.finishSession as ReturnType<typeof mock>).mockResolvedValue({
        ...mockSession,
        finishedAt: new Date(),
        score: 0,
      })

      const result = await learningSessionService.submitAttempt('session1', 'word1', 'answer')
      expect(result).toEqual({ message: 'Session expired and finished.', sessionFinished: true })
      expect(sessionRepo.findSessionById).toHaveBeenCalledWith('session1')
      expect(sessionRepo.finishSession).toHaveBeenCalledWith('session1', expect.any(Number)) // TODO: Score calculation is complex, just check it's a number for now
    })

    test('should return "Word already answered." if word was already attempted', async () => {
      const startedAt = new Date()
      const mockSession = { ...baseSession, startedAt, finishedAt: null }
      const mockAttempt = [{ id: 'att1', wordId: 'word1' }]
      ;(sessionRepo.findSessionById as ReturnType<typeof mock>).mockResolvedValue(mockSession)
      ;(attemptRepo.listAttemptsForSessionAndWord as ReturnType<typeof mock>).mockResolvedValue(mockAttempt)

      const result = await learningSessionService.submitAttempt('session1', 'word1', 'answer')
      expect(result).toEqual({ message: 'Word already answered.', sessionFinished: false })
      expect(sessionRepo.findSessionById).toHaveBeenCalledWith('session1')
      expect(attemptRepo.listAttemptsForSessionAndWord).toHaveBeenCalledWith('session1', 'word1')
    })

    test('should create a correct attempt and return success if next word exists', async () => {
      const startedAt = new Date()
      const mockSession = { ...baseSession, startedAt, finishedAt: null }
      const mockWord = { ...baseWord, term: 'apple' }
      const mockAttempt = {
        id: 'att1',
        learningSessionId: 'session1',
        wordId: 'word1',
        correct: true,
        userAnswer: 'apple',
      }
      const mockNextWord = { ...baseWord, id: 'word2', term: 'banana' }

      ;(sessionRepo.findSessionById as ReturnType<typeof mock>).mockResolvedValue(mockSession)
      ;(attemptRepo.listAttemptsForSessionAndWord as ReturnType<typeof mock>).mockResolvedValue([])
      ;(sessionRepo.getWordById as ReturnType<typeof mock>).mockResolvedValue(mockWord)
      ;(attemptRepo.createAttempt as ReturnType<typeof mock>).mockResolvedValue(mockAttempt)
      ;(sessionRepo.getNextWordForSession as ReturnType<typeof mock>).mockResolvedValue(mockNextWord)

      const result = await learningSessionService.submitAttempt('session1', 'word1', 'apple')
      expect(attemptRepo.createAttempt).toHaveBeenCalledWith({
        learningSessionId: 'session1',
        wordId: 'word1',
        correct: true,
        userAnswer: 'apple',
      })
      expect(result).toEqual({
        userAnswer: 'apple',
        correctAnswer: 'apple',
        correct: true,
        message: 'Attempt submitted successfully.',
        sessionFinished: false,
      })
      expect(sessionRepo.getNextWordForSession).toHaveBeenCalledWith('session1')
      expect(sessionRepo.finishSession).not.toHaveBeenCalled()
    })

    test('should create an incorrect attempt and return success if next word exists', async () => {
      const startedAt = new Date()
      const mockSession = { ...baseSession, startedAt, finishedAt: null }
      const mockWord = { ...baseWord, term: 'apple' }
      const mockAttempt = {
        id: 'att1',
        learningSessionId: 'session1',
        wordId: 'word1',
        correct: false,
        userAnswer: 'orange',
      }
      const mockNextWord = { ...baseWord, id: 'word2', term: 'banana' }

      ;(sessionRepo.findSessionById as ReturnType<typeof mock>).mockResolvedValue(mockSession)
      ;(attemptRepo.listAttemptsForSessionAndWord as ReturnType<typeof mock>).mockResolvedValue([])
      ;(sessionRepo.getWordById as ReturnType<typeof mock>).mockResolvedValue(mockWord)
      ;(attemptRepo.createAttempt as ReturnType<typeof mock>).mockResolvedValue(mockAttempt)
      ;(sessionRepo.getNextWordForSession as ReturnType<typeof mock>).mockResolvedValue(mockNextWord)

      const result = await learningSessionService.submitAttempt('session1', 'word1', 'orange')
      expect(attemptRepo.createAttempt).toHaveBeenCalledWith({
        learningSessionId: 'session1',
        wordId: 'word1',
        correct: false,
        userAnswer: 'orange',
      })
      expect(result).toEqual({
        userAnswer: 'orange',
        correctAnswer: 'apple',
        correct: false,
        message: 'Attempt submitted successfully.',
        sessionFinished: false,
      })
      expect(sessionRepo.getNextWordForSession).toHaveBeenCalledWith('session1')
      expect(sessionRepo.finishSession).not.toHaveBeenCalled()
    })

    test('should finish session if no next word and return sessionFinished: true', async () => {
      const startedAt = new Date()
      const mockSession = { ...baseSession, startedAt, finishedAt: null }
      const mockWord = { ...baseWord, term: 'apple' }
      const mockAttempt = {
        id: 'att1',
        learningSessionId: 'session1',
        wordId: 'word1',
        correct: true,
        userAnswer: 'apple',
      }

      ;(sessionRepo.findSessionById as ReturnType<typeof mock>).mockResolvedValue(mockSession)
      ;(attemptRepo.listAttemptsForSessionAndWord as ReturnType<typeof mock>).mockResolvedValue([])
      ;(sessionRepo.getWordById as ReturnType<typeof mock>).mockResolvedValue(mockWord)
      ;(attemptRepo.createAttempt as ReturnType<typeof mock>).mockResolvedValue(mockAttempt)
      ;(sessionRepo.getNextWordForSession as ReturnType<typeof mock>).mockResolvedValue(null)
      ;(sessionRepo.finishSession as ReturnType<typeof mock>).mockResolvedValue({
        ...mockSession,
        finishedAt: new Date(),
        score: 100,
      })

      const result = await learningSessionService.submitAttempt('session1', 'word1', 'apple')
      expect(attemptRepo.createAttempt).toHaveBeenCalledWith({
        learningSessionId: 'session1',
        wordId: 'word1',
        correct: true,
        userAnswer: 'apple',
      })
      expect(sessionRepo.getNextWordForSession).toHaveBeenCalledWith('session1')
      expect(sessionRepo.finishSession).toHaveBeenCalledWith('session1', expect.any(Number))
      expect(result).toEqual({
        userAnswer: 'apple',
        correctAnswer: 'apple',
        correct: true,
        message: 'No next word. Session finished.',
        sessionFinished: true,
      })
    })
  })
})
