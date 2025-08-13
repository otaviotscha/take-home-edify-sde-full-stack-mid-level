import { Query, Resolver } from '@nestjs/graphql'
import { HealthCheckService } from '@/services/health-check.service'

@Resolver()
export class HealthCheckResolver {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Query(() => String)
  healthCheck(): string {
    return this.healthCheckService.check()
  }
}
