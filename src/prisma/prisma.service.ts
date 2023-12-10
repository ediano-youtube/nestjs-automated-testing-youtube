import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { nameOfTables } from './name-of-tables';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }

  static async cleanDatabase() {
    if (process.env.NODE_ENV === 'test') {
      const models = Reflect.ownKeys(this).filter((key) => {
        if (typeof key !== 'string') return false;
        return nameOfTables.includes(String(key));
      });

      return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
    }
  }
}
