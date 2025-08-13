import { join } from 'node:path'
import { MercuriusDriver, type MercuriusDriverConfig } from '@nestjs/mercurius'

export const graphqlConfig: MercuriusDriverConfig = {
  driver: MercuriusDriver,
  autoSchemaFile: join(process.cwd(), 'src/graphql-api/graphql/schema.gql'),
  sortSchema: true,
  subscription: true,
  graphiql: process.env.NODE_ENV === 'development',
}
