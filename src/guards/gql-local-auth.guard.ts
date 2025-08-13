import { type ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard('local') {
  override getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const { email, password } = ctx.getArgs().input
    ctx.getContext().req.body = { email, password }
    return ctx.getContext().req
  }
}
