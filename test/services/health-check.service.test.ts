import { beforeEach, describe, expect, test } from 'bun:test'
import { Test, TestingModule } from '@nestjs/testing'
import { HealthCheckService } from '@/services/health-check.service'

describe('HealthCheckService', () => {
  let service: HealthCheckService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthCheckService],
    }).compile()

    service = module.get<HealthCheckService>(HealthCheckService)
  })

  test('should be defined', () => {
    expect(service).toBeDefined()
  })

  test('should return "OK" for health check', () => {
    expect(service.check()).toBe('OK')
  })
})
