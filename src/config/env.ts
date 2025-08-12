import { plainToInstance } from 'class-transformer'
import { IsIn, IsInt, IsPositive, validateSync } from 'class-validator'

export class EnvSchema {
  @IsInt()
  @IsPositive()
  GRAPHQL_API_PORT: number = 3000

  @IsIn(['development', 'production', 'test'])
  NODE_ENV!: string
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

export const env = validateEnv(process.env)
