import { PrismaService } from '../src/prisma/prisma.service';

const prismaService = new PrismaService();

export const prismaCleanDatabase = async () => {
  if (process.env.NODE_ENV === 'test') {
    const tablenames = await prismaService.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tablenames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ');

    try {
      await prismaService.$executeRawUnsafe(
        `TRUNCATE TABLE ${tables} CASCADE;`,
      );
    } catch (error) {
      console.log({ error });
    }
  }
};
