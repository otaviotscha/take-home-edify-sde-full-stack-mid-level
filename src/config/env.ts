import { plainToInstance } from 'class-transformer'
import { IsIn, IsInt, IsPositive, validateSync } from 'class-validator'
import { IsPostgresUrl } from '@/utils/customValidators'

export class EnvSchema {
  @IsInt()
  @IsPositive()
  GRAPHQL_API_PORT!: number

  @IsIn(['development', 'production', 'test'])
  NODE_ENV!: string

  @IsPostgresUrl()
  DATABASE_URL!: string
}

export const validateEnv = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvSchema, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, { skipMissingProperties: false })
  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}

let cachedEnv: EnvSchema

export const getEnv = () => {
  if (!cachedEnv) {
    cachedEnv = validateEnv(process.env)
  }
  return cachedEnv
}
