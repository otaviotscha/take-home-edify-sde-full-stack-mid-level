import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['student', 'teacher'])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
})

export type User = typeof users.$inferSelect
export type CreateUser = typeof users.$inferInsert
export type UpdateUser = Partial<typeof users.$inferInsert>

export const difficultyLevelEnum = pgEnum('difficulty_level', [
  'A1-beginner',
  'A2-elementary',
  'B1-intermediate',
  'B2-upper-intermediate',
  'C1-advanced',
  'C2-proficient',
])

export const vocabularySets = pgTable('vocabulary_sets', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  difficulty: difficultyLevelEnum('difficulty').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export type VocabularySet = typeof vocabularySets.$inferSelect
export type CreateVocabularySet = typeof vocabularySets.$inferInsert
export type UpdateVocabularySet = Partial<typeof vocabularySets.$inferInsert>

export const words = pgTable('words', {
  id: uuid('id').defaultRandom().primaryKey(),
  vocabularySetId: uuid('vocabulary_set_id')
    .notNull()
    .references(() => vocabularySets.id, { onDelete: 'cascade' }),
  term: varchar('term', { length: 255 }).notNull(),
  definition: text('definition').notNull(),
  exampleSentence: text('example_sentence'),
})

export type Word = typeof words.$inferSelect
export type CreateWord = typeof words.$inferInsert
export type UpdateWord = Partial<typeof words.$inferInsert>

export const learningSessions = pgTable('learning_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  vocabularySetId: uuid('vocabulary_set_id')
    .notNull()
    .references(() => vocabularySets.id, { onDelete: 'cascade' }),
  difficulty: difficultyLevelEnum('difficulty').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  finishedAt: timestamp('finished_at'),
  score: integer('score').notNull().default(0),
})

export type LearningSession = typeof learningSessions.$inferSelect
export type CreateLearningSession = typeof learningSessions.$inferInsert
export type UpdateLearningSession = Partial<typeof learningSessions.$inferInsert>

export const attempts = pgTable('attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  learningSessionId: uuid('learning_session_id')
    .notNull()
    .references(() => learningSessions.id, { onDelete: 'cascade' }),
  wordId: uuid('word_id')
    .notNull()
    .references(() => words.id, { onDelete: 'cascade' }),
  correct: boolean('correct').notNull(),
  userAnswer: text('user_answer').notNull(),
  attemptedAt: timestamp('attempted_at').defaultNow(),
})

export type Attempt = typeof attempts.$inferSelect
export type CreateAttempt = typeof attempts.$inferInsert
export type UpdateAttempt = Partial<typeof attempts.$inferInsert>
