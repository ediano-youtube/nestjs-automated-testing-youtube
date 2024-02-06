import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType('UpdateUserInput')
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field(() => ID)
  id: string;
}
