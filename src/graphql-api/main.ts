// biome-ignore assist/source/organizeImports: reflect-metadata and env should load first
import 'reflect-metadata'
import { getEnv } from '@/config/env'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { AppModule } from '@/graphql-api/app.module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, new FastifyAdapter())
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(getEnv().GRAPHQL_API_PORT, '0.0.0.0')
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
