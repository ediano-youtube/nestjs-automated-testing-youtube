import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from '../email/email.module';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [EmailModule],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
})
export class UsersModule {}
