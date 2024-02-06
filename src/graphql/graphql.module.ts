import { Module } from '@nestjs/common';
import { join } from 'node:path';

import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
    }),
  ],
})
export class GraphqlModule {}
