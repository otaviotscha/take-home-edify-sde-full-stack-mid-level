import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { User } from '@/db/schema'
import { isAdmin as isAdminFunc } from '@/utils'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    const user: User = req.user

    const isAdmin = isAdminFunc(user.role?.toLowerCase())

    if (!isAdmin) {
      throw new ForbiddenException('Must be admin')
    }

    return true
  }
}
