import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateVideoInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  url: string;

  @Field(() => ID)
  userId: string;
}
