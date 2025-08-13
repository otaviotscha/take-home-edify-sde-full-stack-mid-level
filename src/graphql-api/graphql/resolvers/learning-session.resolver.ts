import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { type User } from '@/db/schema'
import { CurrentUser } from '@/graphql-api/decorators/current-user.decorator'
import {
  SubmitAttemptFailureResponse,
  SubmitAttemptInput,
  SubmitAttemptSuccessResponse,
} from '@/graphql-api/graphql/dtos/attempt.dto'
import { LearningSessionResponse, StartLearningSessionInput } from '@/graphql-api/graphql/dtos/learning-session.dto'
import { WordResponse } from '@/graphql-api/graphql/dtos/word.dto'
import { GqlAuthRolesGuard } from '@/graphql-api/graphql/guards/gql-auth-roles.guard'
import { LearningSessionService } from '@/services/learning-session.service'

@Resolver(() => LearningSessionResponse)
export class LearningSessionResolver {
  constructor(private readonly sessionService: LearningSessionService) {}

  @Query(() => LearningSessionResponse)
  @UseGuards(GqlAuthRolesGuard)
  getSession(@Args('id') id: string): Promise<LearningSessionResponse> {
    return this.sessionService.getSessionById(id)
  }

  @Query(() => [LearningSessionResponse])
  @UseGuards(GqlAuthRolesGuard)
  listSessions(@CurrentUser() user: User): Promise<LearningSessionResponse[]> {
    return this.sessionService.listSessionsByStudent(user.id)
  }

  @Query(() => WordResponse, { nullable: true })
  @UseGuards(GqlAuthRolesGuard)
  getNextWord(@Args('sessionId') sessionId: string): Promise<WordResponse | null> {
    return this.sessionService.getNextWordForSession(sessionId)
  }

  @Mutation(() => LearningSessionResponse)
  @UseGuards(GqlAuthRolesGuard)
  startSession(
    @Args('input') input: StartLearningSessionInput,
    @CurrentUser() user: User
  ): Promise<LearningSessionResponse | null> {
    return this.sessionService.startSession(input, user.id)
  }

  @Mutation(() => SubmitAttemptSuccessResponse || SubmitAttemptFailureResponse)
  @UseGuards(GqlAuthRolesGuard)
  async submitAttempt(
    @Args('input') input: SubmitAttemptInput
  ): Promise<SubmitAttemptSuccessResponse | SubmitAttemptFailureResponse> {
    const result = await this.sessionService.submitAttempt(input.sessionId, input.wordId, input.userAnswer)
    return result
  }
}
