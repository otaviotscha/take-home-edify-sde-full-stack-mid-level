import { beforeEach, describe, expect, test } from 'bun:test'
import { IsPostgresUrlConstraint } from '@/utils/customValidators'

describe('IsPostgresUrlConstraint', () => {
  let validator: IsPostgresUrlConstraint

  beforeEach(() => {
    validator = new IsPostgresUrlConstraint()
  })

  test('should validate a valid PostgreSQL URL', () => {
    const validUrl = 'postgresql://user:password@host:5432/database'
    expect(validator.validate(validUrl)).toBe(true)
  })

  test('should invalidate an invalid URL format', () => {
    const invalidUrl = 'http://example.com'
    expect(validator.validate(invalidUrl)).toBe(false)
  })

  test('should invalidate a URL with missing parts', () => {
    const invalidUrl = 'postgresql://user:password@host/database' // Missing port
    expect(validator.validate(invalidUrl)).toBe(false)
  })

  test('should invalidate a non-string input', () => {
    // biome-ignore lint/suspicious/noExplicitAny: needed for test purposes
    expect(validator.validate(true as any)).toBe(false)
    // biome-ignore lint/suspicious/noExplicitAny: needed for test purposes
    expect(validator.validate(123 as any)).toBe(false)
    // biome-ignore lint/suspicious/noExplicitAny: needed for test purposes
    expect(validator.validate(null as any)).toBe(false)
    // biome-ignore lint/suspicious/noExplicitAny: needed for test purposes
    expect(validator.validate(undefined as any)).toBe(false)
  })

  test('should return correct default message', () => {
    expect(validator.defaultMessage()).toBe('URL must be a valid PostgreSQL connection string')
  })
})
