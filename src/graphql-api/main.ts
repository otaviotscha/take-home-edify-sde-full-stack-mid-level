import 'reflect-metadata'

import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { AppModule } from '@/graphql-api/app.module'
import { env } from '@/graphql-api/config/env'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, new FastifyAdapter())
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(env.GRAPHQL_API_PORT)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
