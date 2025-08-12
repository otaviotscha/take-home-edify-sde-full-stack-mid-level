import { beforeEach, describe, expect, test } from 'bun:test'
import { Test, TestingModule } from '@nestjs/testing'
import { HealthCheckModule } from '@/graphql-api/modules/health-check.module'
import { HealthCheckService } from '@/services/health-check.service'

describe('HealthCheckModule', () => {
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [HealthCheckModule],
    }).compile()
  })

  test('should be defined', () => {
    expect(module).toBeDefined()
  })

  test('should provide HealthCheckService', () => {
    const service = module.get<HealthCheckService>(HealthCheckService)
    expect(service).toBeDefined()
    expect(service.check()).toBe('OK')
  })
})
