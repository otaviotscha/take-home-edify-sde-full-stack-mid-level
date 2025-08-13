import 'reflect-metadata'
import { defineConfig } from 'drizzle-kit'
import { getEnv } from '@/config/env'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: getEnv().DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
