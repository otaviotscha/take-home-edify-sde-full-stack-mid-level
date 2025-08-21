import { describe, expect, test } from 'bun:test'
import { isAdmin } from '../../src/utils/index'

describe('Utils', () => {
  describe('isAdmin', () => {
    test('should be defined', () => {
      expect(isAdmin).toBeDefined()
    })

    test('should return true for teacher role', () => {
      expect(isAdmin('teacher')).toBe(true)
      expect(isAdmin('TEACHER')).toBe(true)
      expect(isAdmin('Teacher')).toBe(true)
      expect(isAdmin('TEaChEr')).toBe(true)
    })

    test('should return false for non-teacher roles', () => {
      expect(isAdmin('student')).toBe(false)
      expect(isAdmin('STUDENT')).toBe(false)
      expect(isAdmin('Student')).toBe(false)
      expect(isAdmin('admin')).toBe(false)
      expect(isAdmin('user')).toBe(false)
      expect(isAdmin('')).toBe(false)
    })

    test('should return false for empty string', () => {
      expect(isAdmin('')).toBe(false)
    })

    test('should return false for undefined role', () => {
      expect(isAdmin('')).toBe(false)
    })

    test('should handle case insensitive comparison', () => {
      expect(isAdmin('TEACHER')).toBe(true)
      expect(isAdmin('teacher')).toBe(true)
      expect(isAdmin('Teacher')).toBe(true)
      expect(isAdmin('TEaChEr')).toBe(true)
    })

    test('should handle roles with extra whitespace', () => {
      expect(isAdmin(' teacher ')).toBe(false)
      expect(isAdmin('teacher ')).toBe(false)
      expect(isAdmin(' teacher')).toBe(false)
    })

    test('should return a boolean value', () => {
      expect(typeof isAdmin('teacher')).toBe('boolean')
      expect(typeof isAdmin('student')).toBe('boolean')
      expect(typeof isAdmin('')).toBe('boolean')
    })
  })
})
