import { type ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import type { User } from '@/db/schema'
import { ROLES_KEY } from '@/graphql-api/decorators/roles.decorator'

@Injectable()
export class GqlAuthRolesGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  override getRequest(context: ExecutionContext): unknown {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context)
    if (!canActivate) return false
    return this.checkRoles(context)
  }

  private checkRoles(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const ctx = GqlExecutionContext.create(context)
    const user: User = ctx.getContext().req.user

    if (!user) return false

    const userRole = user.role?.toLowerCase()
    const allowedRoles = requiredRoles.map((r) => r.toLowerCase())

    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenException('You do not have permission to perform this action')
    }

    return true
  }
}
