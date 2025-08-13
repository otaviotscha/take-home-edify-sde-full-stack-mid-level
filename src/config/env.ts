import 'reflect-metadata'
import { plainToInstance } from 'class-transformer'
import { IsIn, IsInt, IsNotEmpty, IsPositive, IsString, validateSync } from 'class-validator'
import { IsPostgresUrl } from '@/utils/customValidators'

export class EnvSchema {
  @IsInt()
  @IsPositive()
  GRAPHQL_API_PORT!: number

  @IsIn(['development', 'production', 'test'])
  NODE_ENV!: string

  @IsPostgresUrl()
  DATABASE_URL!: string

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string
}

export const validateEnv = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvSchema, config, {
    enableImplicitConversion: true,
  })

  if (validatedConfig.NODE_ENV !== 'test') {
    const errors = validateSync(validatedConfig, { skipMissingProperties: false })
    if (errors.length > 0) {
      throw new Error(errors.toString())
    }
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
