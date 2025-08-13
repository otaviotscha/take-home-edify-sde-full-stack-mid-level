import { beforeEach, describe, expect, test } from 'bun:test'
import { Test, TestingModule } from '@nestjs/testing'
import { UserResolver } from '@/graphql-api/graphql/resolvers/user.resolver'
import { UserModule } from '@/graphql-api/modules/user.module'
import { HashService } from '@/services/hash.service'
import { UserService } from '@/services/user.service'

describe('UserModule', () => {
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(UserService)
      .useValue({})
      .overrideProvider(UserResolver)
      .useValue({})
      .overrideProvider(HashService)
      .useValue({})
      .compile()
  })

  test('should be defined', () => {
    expect(module).toBeDefined()
  })

  test('should provide UserService, UserResolver, and HashService', () => {
    const userService = module.get<UserService>(UserService)
    const userResolver = module.get<UserResolver>(UserResolver)
    const hashService = module.get<HashService>(HashService)

    expect(userService).toBeDefined()
    expect(userResolver).toBeDefined()
    expect(hashService).toBeDefined()
  })
})
