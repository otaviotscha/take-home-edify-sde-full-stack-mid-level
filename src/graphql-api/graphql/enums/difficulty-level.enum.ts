import { registerEnumType } from '@nestjs/graphql'
import { DifficultyLevelEnum } from '@/db/schema'

registerEnumType(DifficultyLevelEnum, {
  name: 'DifficultyLevel',
})
