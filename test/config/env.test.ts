// biome-ignore assist/source/organizeImports: reflect-metadata should load first
import 'reflect-metadata'
import { describe, expect, test, beforeEach, afterEach } from 'bun:test'

describe('EnvSchema Validation', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    // Store original process.env
    originalEnv = { ...process.env }
    // Clear process.env for isolation
    process.env = {}
  })

  afterEach(() => {
    // Restore original process.env after each test
    process.env = originalEnv
  })

  // Helper to clear cache and re-import for each test that modifies process.env
  const getFreshEnv = () => {
    delete require.cache[require.resolve('@/config/env')]
    return require('@/config/env').getEnv()
  }

  test('should validate with valid environment variables', () => {
    process.env.GRAPHQL_API_PORT = '3000'
    process.env.NODE_ENV = 'development'
    process.env.DATABASE_URL = 'postgresql://user:password@host:5432/database'
    process.env.JWT_SECRET = 'test-secret'

    const validatedConfig = getFreshEnv()
    expect(validatedConfig.GRAPHQL_API_PORT).toBe(3000)
    expect(validatedConfig.NODE_ENV).toBe('development')
    expect(validatedConfig.DATABASE_URL).toBe('postgresql://user:password@host:5432/database')
  })

  test('should throw error if GRAPHQL_API_PORT is missing', () => {
    process.env = {
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://user:password@host:5432/database',
    }
    expect(() => getFreshEnv()).toThrow()
  })

  test('should throw error if GRAPHQL_API_PORT is not a positive integer', () => {
    process.env = {
      GRAPHQL_API_PORT: '-100',
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://user:password@host:5432/database',
    }
    expect(() => getFreshEnv()).toThrow()

    process.env = {
      GRAPHQL_API_PORT: 'abc',
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://user:password@host:5432/database',
    }
    expect(() => getFreshEnv()).toThrow()
  })

  test('should throw error if NODE_ENV is missing', () => {
    process.env = {
      GRAPHQL_API_PORT: '3000',
      DATABASE_URL: 'postgresql://user:password@host:5432/database',
    }
    expect(() => getFreshEnv()).toThrow()
  })

  test('should throw error if NODE_ENV is invalid', () => {
    process.env = {
      GRAPHQL_API_PORT: '3000',
      NODE_ENV: 'invalid',
      DATABASE_URL: 'postgresql://user:password@host:5432/database',
    }
    expect(() => getFreshEnv()).toThrow()
  })

  test('should throw error if DATABASE_URL is missing', () => {
    process.env = {
      GRAPHQL_API_PORT: '3000',
      NODE_ENV: 'development',
    }
    expect(() => getFreshEnv()).toThrow()
  })

  test('should throw error if DATABASE_URL is invalid', () => {
    process.env = {
      GRAPHQL_API_PORT: '3000',
      NODE_ENV: 'development',
      DATABASE_URL: 'invalid-url',
    }
    expect(() => getFreshEnv()).toThrow()
  })
})
