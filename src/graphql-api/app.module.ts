import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { graphqlConfig } from '@/graphql-api/config/graphql'
import { AuthModule } from '@/graphql-api/modules/auth.module'
import { HealthCheckModule } from '@/graphql-api/modules/health-check.module'
import { UserModule } from '@/graphql-api/modules/user.module'

@Module({
  imports: [GraphQLModule.forRoot(graphqlConfig), HealthCheckModule, UserModule, AuthModule],
})
export class AppModule {}
