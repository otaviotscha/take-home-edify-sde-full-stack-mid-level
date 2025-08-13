import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { type User } from '@/db/schema'
import { CurrentUser } from '@/graphql-api/decorators/current-user.decorator'
import { SubmitAttemptInput, SubmitAttemptResponse } from '@/graphql-api/graphql/dtos/attempt.dto'
import {
  FinishLearningSessionInput,
  LearningSession,
  StartLearningSessionInput,
} from '@/graphql-api/graphql/dtos/learning-session.dto'
import { Word } from '@/graphql-api/graphql/dtos/word.dto'
import { GqlAuthRolesGuard } from '@/graphql-api/guards/gql-auth-roles.guard'
import { LearningSessionService } from '@/services/learning-session.service'

@Resolver(() => LearningSession)
export class LearningSessionResolver {
  constructor(private readonly sessionService: LearningSessionService) {}

  @Query(() => LearningSession)
  @UseGuards(GqlAuthRolesGuard)
  getSession(@Args('id') id: string) {
    return this.sessionService.getSessionById(id)
  }

  @Query(() => [LearningSession])
  @UseGuards(GqlAuthRolesGuard)
  listSessions(@CurrentUser() user: User) {
    return this.sessionService.listSessionsByStudent(user.id)
  }

  @Query(() => Word, { nullable: true })
  @UseGuards(GqlAuthRolesGuard)
  getNextWord(@Args('sessionId') sessionId: string) {
    return this.sessionService.getNextWordForSession(sessionId)
  }

  @Mutation(() => LearningSession)
  @UseGuards(GqlAuthRolesGuard)
  startSession(@Args('input') input: StartLearningSessionInput, @CurrentUser() user: User) {
    return this.sessionService.startSession(input, user.id)
  }

  @Mutation(() => LearningSession)
  @UseGuards(GqlAuthRolesGuard)
  finishSession(@Args('input') input: FinishLearningSessionInput) {
    return this.sessionService.finishSession(input)
  }

  @Mutation(() => SubmitAttemptResponse)
  @UseGuards(GqlAuthRolesGuard)
  async submitAttempt(@Args('input') input: SubmitAttemptInput) {
    const result = await this.sessionService.submitAttempt(input.sessionId, input.wordId, input.userAnswer)
    return result
  }
}
