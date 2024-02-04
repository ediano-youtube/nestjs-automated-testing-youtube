import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType('CreateUserInput')
export class CreateUserDto {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  password: string;
}
