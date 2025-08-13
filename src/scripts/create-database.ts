import { DatabaseError, Pool } from 'pg'

const databaseUrl =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/take-home-edify-sde-full-stack-mid-level'
console.log(`DEBUG: Original DATABASE_URL: ${databaseUrl}`)

const url = new URL(databaseUrl)
url.pathname = '/postgres' // Connect to the default 'postgres' database to create the new one

const poolConnectionString = url.toString()
console.log(`DEBUG: Pool Connection String: ${poolConnectionString}`)

const pool = new Pool({
  connectionString: poolConnectionString,
})

const createDatabase = async () => {
  try {
    await pool.query('CREATE DATABASE "take-home-edify-sde-full-stack-mid-level"')
    console.log('Database created')
  } catch (error: unknown) {
    if (error instanceof DatabaseError && error.code === '42P04' && error.message.includes('already exists')) {
      return console.log('Database already exists')
    }
    throw error
  }
}

await createDatabase()

process.exit()
