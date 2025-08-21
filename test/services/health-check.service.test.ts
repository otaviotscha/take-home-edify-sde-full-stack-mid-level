import { beforeEach, describe, expect, test } from 'bun:test'
import { HealthCheckService } from '@/services/health-check.service'

describe('HealthCheckService', () => {
  let healthCheckService: HealthCheckService

  beforeEach(() => {
    healthCheckService = new HealthCheckService()
  })

  test('should be defined', () => {
    expect(healthCheckService).toBeDefined()
  })

  describe('check', () => {
    test('returns "OK"', () => {
      expect(healthCheckService.check()).toBe('OK')
    })

    test('returns a string type', () => {
      expect(typeof healthCheckService.check()).toBe('string')
    })
  })
})
