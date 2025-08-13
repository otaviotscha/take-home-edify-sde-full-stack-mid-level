import { Module } from '@nestjs/common'
import { HealthCheckResolver } from '@/graphql-api/graphql/resolvers/health-check.resolver'
import { HealthCheckService } from '@/services/health-check.service'

@Module({
  providers: [HealthCheckService, HealthCheckResolver],
})
export class HealthCheckModule {}
