import { registerEnumType } from '@nestjs/graphql'

export enum DifficultyLevel {
  A1 = 'A1-beginner',
  A2 = 'A2-elementary',
  B1 = 'B1-intermediate',
  B2 = 'B2-upper-intermediate',
  C1 = 'C1-advanced',
  C2 = 'C2-proficient',
}

registerEnumType(DifficultyLevel, {
  name: 'DifficultyLevel',
})
