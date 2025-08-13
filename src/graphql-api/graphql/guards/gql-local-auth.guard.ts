import { type ExecutionContext, Injectable, type Type } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard, type IAuthGuard } from '@nestjs/passport'

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard('local') {
  override getRequest(context: ExecutionContext): Type<IAuthGuard> {
    const ctx = GqlExecutionContext.create(context)
    const { email, password } = ctx.getArgs().input
    ctx.getContext().req.body = { email, password }
    return ctx.getContext().req
  }
}
