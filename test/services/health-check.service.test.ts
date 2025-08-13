import { beforeEach, describe, expect, it } from 'bun:test'
import { HealthCheckService } from '@/services/health-check.service'

describe('HealthCheckService', () => {
  let healthCheckService: HealthCheckService

  beforeEach(() => {
    healthCheckService = new HealthCheckService()
  })

  it('should be defined', () => {
    expect(healthCheckService).toBeDefined()
  })

  describe('check', () => {
    it('returns "OK"', () => {
      expect(healthCheckService.check()).toBe('OK')
    })

    it('returns a string type', () => {
      expect(typeof healthCheckService.check()).toBe('string')
    })
  })
})
