import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User as UserPrisma } from '@prisma/client';

@ObjectType()
export class User implements UserPrisma {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  passwordHash: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
