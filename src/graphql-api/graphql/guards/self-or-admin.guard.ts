import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { User } from '@/db/schema'
import { isAdmin as isAdminFunc } from '@/utils'

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    const user: User = req.user
    const args = ctx.getArgs()

    const targetId = args.input?.id

    const isSelf = targetId === user.id
    const isAdmin = isAdminFunc(user.role?.toLowerCase())

    if (!isSelf && !isAdmin) {
      throw new ForbiddenException('You can only update your own account')
    }

    return true
  }
}
