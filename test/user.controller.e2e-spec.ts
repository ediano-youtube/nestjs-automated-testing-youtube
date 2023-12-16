import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { prismaCleanDatabase } from './prisma-clean-database';
import { EmailService } from '../src/email/email.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let emailService: EmailService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    emailService = moduleFixture.get<EmailService>(EmailService);
  });

  beforeEach(async () => {
    await prismaCleanDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('Bad Request 400', async () => {
      return request(app.getHttpServer())
        .post('/users')
        .expect(400)
        .then((response) => {
          const body = response.body;
          expect(body).toEqual({
            message: [
              'name must be a string',
              'email must be an email',
              'email must be a string',
              'password must be a string',
            ],
            error: 'Bad Request',
            statusCode: 400,
          });
        });
    });

    it('User already exists', async () => {
      const data: CreateUserDto = {
        name: 'Ediano',
        email: 'ediano@gmail.com',
        password: '123456789',
      };

      await prismaService.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: data.password,
        },
      });

      return request(app.getHttpServer())
        .post('/users')
        .send(data)
        .expect(409)
        .then((response) => {
          const body = response.body;
          expect(body).toEqual({
            message: 'User already exists',
            statusCode: 409,
          });
        });
    });

    it('Create user', async () => {
      const data: CreateUserDto = {
        name: 'Ediano',
        email: 'ediano@gmail.com',
        password: '123456789',
      };

      jest.spyOn(emailService, 'send').mockImplementationOnce((dto) => dto);

      return request(app.getHttpServer())
        .post('/users')
        .send(data)
        .expect(201)
        .then((response) => {
          const body = response.body;
          expect(body).toEqual({
            id: expect.any(String),
            name: 'Ediano',
            email: 'ediano@gmail.com',
            passwordHash: '123456789',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });

          expect(jest.spyOn(emailService, 'send')).toHaveBeenCalledTimes(1);
        });
    });
  });

  describe('/users (GET)', () => {
    it('Not findAll Users', async () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(body).toEqual([]);
        });
    });

    it('findAll Users', async () => {
      const data: CreateUserDto = {
        name: 'Ediano',
        email: 'ediano@gmail.com',
        password: '123456789',
      };

      await prismaService.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: data.password,
        },
      });

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(body).toEqual([
            {
              id: expect.any(String),
              email: 'ediano@gmail.com',
              name: 'Ediano',
              passwordHash: '123456789',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          ]);
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('Not findOne User', async () => {
      return request(app.getHttpServer())
        .get('/users/c93df2c4-b5f8-4608-8311-6407d0125b73')
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(body).toEqual({});
        });
    });

    it('findOne User', async () => {
      const data: CreateUserDto = {
        name: 'Ediano',
        email: 'ediano@gmail.com',
        password: '123456789',
      };

      const user = await prismaService.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: data.password,
        },
      });

      return request(app.getHttpServer())
        .get('/users/' + user.id)
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(body).toEqual({
            id: expect.any(String),
            email: 'ediano@gmail.com',
            name: 'Ediano',
            passwordHash: '123456789',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });
  });

  describe('/users (PATCH)', () => {
    it('User do not exists', async () => {
      const data: CreateUserDto = {
        name: 'Ediano',
        email: 'ediano@gmail.com',
        password: '123456789',
      };

      return request(app.getHttpServer())
        .patch('/users/fbc473d9-5247-4b4a-9753-2d50936ea1b7')
        .send(data)
        .expect(404)
        .then((response) => {
          const body = response.body;
          expect(body).toEqual({
            message: 'User do not exists',
            statusCode: 404,
          });
        });
    });

    it('Update user', async () => {
      const data: CreateUserDto = {
        name: 'Ediano',
        email: 'ediano@gmail.com',
        password: '123456789',
      };

      const user = await prismaService.user.create({
        data: {
          name: data.name,
          email: 'ediano2@gmail.com',
          passwordHash: data.password,
        },
      });

      return request(app.getHttpServer())
        .patch('/users/' + user.id)
        .send(data)
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(body).toEqual({
            id: expect.any(String),
            name: 'Ediano',
            email: 'ediano@gmail.com',
            passwordHash: '123456789',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });
  });

  describe('/users (DELETE)', () => {
    it('User do not exists', async () => {
      return request(app.getHttpServer())
        .delete('/users/fbc473d9-5247-4b4a-9753-2d50936ea1b7')
        .expect(404)
        .then((response) => {
          const body = response.body;
          expect(body).toEqual({
            message: 'User do not exists',
            statusCode: 404,
          });
        });
    });

    it('Delete user', async () => {
      const user = await prismaService.user.create({
        data: {
          name: 'Ediano',
          email: 'ediano2@gmail.com',
          passwordHash: '123456789',
        },
      });

      return request(app.getHttpServer())
        .delete('/users/' + user.id)
        .expect(200)
        .then(async (response) => {
          const body = response.body;
          expect(body).toEqual({});

          const getUser = await prismaService.user.findUnique({
            where: { id: user.id },
          });

          expect(getUser).toBeNull;
        });
    });
  });
});
