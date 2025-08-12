import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { graphqlConfig } from '@/graphql-api/config/graphql'
import { HealthCheckModule } from '@/graphql-api/modules/health-check.module'

@Module({
  imports: [GraphQLModule.forRoot(graphqlConfig), HealthCheckModule],
})
export class AppModule {}
