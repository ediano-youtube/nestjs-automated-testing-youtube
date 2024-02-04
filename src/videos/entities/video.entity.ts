import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Video as VideoPrisma } from '@prisma/client';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Video implements VideoPrisma {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  userId: string;

  user: User;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
