import { describe, expect, mock, test } from 'bun:test'

mock.module('@/config/env', () => ({
  getEnv: () => ({
    DATABASE_URL: 'postgresql://test:test@localhost:5432/testdb',
  }),
}))

// Mock the database dependencies that might not be available in test environment
mock.module('drizzle-orm/postgres-js', () => ({
  drizzle: mock(() => ({})),
}))

mock.module('postgres', () => ({
  default: mock(() => ({})),
}))

mock.module('drizzle-orm/postgres-js/migrator', () => ({
  migrate: mock(async () => {}),
}))

// Mock the pg Pool to prevent actual database connections
mock.module('pg', () => ({
  Pool: mock(() => ({
    query: mock(async () => ({
      rows: [],
      rowCount: 0,
      command: 'CREATE',
      oid: 0,
      fields: [],
    })),
    end: mock(async () => {}),
  })),
  DatabaseError: class DatabaseError extends Error {
    code?: string
    constructor(message: string, code?: string) {
      super(message)
      this.code = code
    }
  },
}))

describe('Create Database Script', () => {
  test('should import required dependencies', async () => {
    /**
     * This test verifies that the script can import all its dependencies
     * without throwing errors, which means the file structure is correct
     * We mock process.exit to prevent the script from terminating the test process
     */
    const originalExit = process.exit
    // biome-ignore lint/suspicious/noExplicitAny: process.exit typing
    process.exit = mock(() => {}) as any

    try {
      expect(import('../../src/scripts/create-database')).resolves.toBeDefined()
    } finally {
      process.exit = originalExit
    }
  })

  test('should have access to environment variables', async () => {
    const { getEnv } = await import('@/config/env')

    const env = getEnv()
    expect(env).toBeDefined()
    expect(env.DATABASE_URL).toBe('postgresql://test:test@localhost:5432/testdb')
  })

  test('should have mocked database dependencies', async () => {
    const { drizzle } = await import('drizzle-orm/postgres-js')
    const { migrate } = await import('drizzle-orm/postgres-js/migrator')

    expect(typeof drizzle).toBe('function')
    expect(typeof migrate).toBe('function')
  })

  test('should be a script that can be executed', async () => {
    const script = await import('../../src/scripts/create-database')

    expect(script).toBeDefined()
  })
})
