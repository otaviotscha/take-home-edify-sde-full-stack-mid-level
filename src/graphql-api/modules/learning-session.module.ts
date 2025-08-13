import { Module } from '@nestjs/common'
import { LearningSessionResolver } from '@/graphql-api/graphql/resolvers/learning-session.resolver'
import { WordModule } from '@/graphql-api/modules/word.module'
import { AttemptRepository } from '@/repositories/attempt.repository'
import { LearningSessionRepository } from '@/repositories/learning-session.repository'
import { WordRepository } from '@/repositories/word.repository'
import { LearningSessionService } from '@/services/learning-session.service'

@Module({
  imports: [WordModule],
  providers: [
    LearningSessionResolver,
    LearningSessionService,
    LearningSessionRepository,
    AttemptRepository,
    WordRepository,
  ],
  exports: [LearningSessionService],
})
export class LearningSessionModule {}
