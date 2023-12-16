import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule, PrismaModule, EmailModule],
})
export class AppModule {}
