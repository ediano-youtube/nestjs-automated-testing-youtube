import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateVideoInput } from './create-video.input';

@InputType()
export class UpdateVideoInput extends PartialType(CreateVideoInput) {
  @Field(() => ID)
  id: string;
}
