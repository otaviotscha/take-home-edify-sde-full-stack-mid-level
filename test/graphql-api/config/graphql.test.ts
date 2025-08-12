import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { join } from 'node:path' // Import join for autoSchemaFile test

describe('graphqlConfig', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
    process.env = {}
  })

  afterEach(() => {
    process.env = originalEnv
  })

  // Helper to clear cache and re-import for each test that modifies process.env
  const getFreshGraphqlConfig = () => {
    delete require.cache[require.resolve('@/graphql-api/config/graphql')]
    return require('@/graphql-api/config/graphql').graphqlConfig
  }

  test('graphiql should be true in development environment', () => {
    process.env.NODE_ENV = 'development'
    const devConfig = getFreshGraphqlConfig()
    expect(devConfig.graphiql).toBe(true)
  })

  test('graphiql should be false in production environment', () => {
    process.env.NODE_ENV = 'production'
    const prodConfig = getFreshGraphqlConfig()
    expect(prodConfig.graphiql).toBe(false)
  })

  test('graphiql should be false in test environment', () => {
    process.env.NODE_ENV = 'test'
    const testConfig = getFreshGraphqlConfig()
    expect(testConfig.graphiql).toBe(false)
  })

  test('autoSchemaFile should be correctly set', () => {
    const currentConfig = getFreshGraphqlConfig()
    const expectedPath = join(process.cwd(), 'src/graphql-api/graphql/schema.gql')
    expect(currentConfig.autoSchemaFile).toBe(expectedPath)
  })

  test('subscription should be true', () => {
    const currentConfig = getFreshGraphqlConfig()
    expect(currentConfig.subscription).toBe(true)
  })
})
