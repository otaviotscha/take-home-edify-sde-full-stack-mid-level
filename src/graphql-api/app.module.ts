import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { graphqlConfig } from '@/graphql-api/config/graphql'
import { AuthModule } from '@/graphql-api/modules/auth.module'
import { HealthCheckModule } from '@/graphql-api/modules/health-check.module'
import { LearningSessionModule } from '@/graphql-api/modules/learning-session.module'
import { UserModule } from '@/graphql-api/modules/user.module'
import { VocabularyModule } from '@/graphql-api/modules/vocabulary.module'
import { WordModule } from '@/graphql-api/modules/word.module'

@Module({
  imports: [
    GraphQLModule.forRoot(graphqlConfig),
    HealthCheckModule,
    UserModule,
    AuthModule,
    VocabularyModule,
    WordModule,
    LearningSessionModule,
  ],
})
export class AppModule {}
