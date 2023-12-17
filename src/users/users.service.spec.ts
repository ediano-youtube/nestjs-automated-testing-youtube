import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../email/email.service';

const uuid = '0f8618ca-8b4b-48dd-bd47-65d290294861';

describe('UsersService', () => {
  let usersService: UsersService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockEmailService = {
    send: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('User already exists', async () => {
      const userDto: CreateUserDto = {
        name: 'Ediano',
        email: 'ediano@gmail.com',
        password: '123456',
      };

      mockPrismaService.user.findUnique.mockReturnValueOnce(userDto);

      try {
        await usersService.create(userDto);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('User already exists');
      }

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: userDto.email },
      });

      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(0);
    });

    it('Create user', async () => {
      const userDto: CreateUserDto = {
        name: 'Ediano',
        email: 'ediano@gmail.com',
        password: '123456',
      };

      mockPrismaService.user.findUnique.mockReturnValueOnce(null);

      await usersService.create(userDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: userDto.email },
      });

      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: userDto.email,
          name: userDto.name,
          passwordHash: userDto.password,
        },
      });
    });
  });

  it('findAll', async () => {
    const userDto: CreateUserDto = {
      name: 'Ediano',
      email: 'ediano@gmail.com',
      password: '123456',
    };

    mockPrismaService.user.findMany.mockReturnValueOnce([userDto]);

    const users = await usersService.findAll();

    expect(users).toEqual(expect.objectContaining([userDto]));
    expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
  });

  it('findOne', async () => {
    const userDto: CreateUserDto = {
      name: 'Ediano',
      email: 'ediano@gmail.com',
      password: '123456',
    };

    mockPrismaService.user.findUnique.mockReturnValueOnce(userDto);

    const users = await usersService.findOne(uuid);

    expect(users).toEqual(expect.objectContaining(userDto));
    expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: uuid },
    });
  });

  describe('update', () => {
    it('User do not exists', async () => {
      const userDto: UpdateUserDto = {
        name: 'Ediano',
        email: 'ediano@gmail.com',
        password: '123456',
      };

      mockPrismaService.user.findUnique.mockReturnValueOnce(null);

      try {
        await usersService.update(uuid, userDto);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('User do not exists');
      }

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: uuid },
      });

      expect(mockPrismaService.user.update).toHaveBeenCalledTimes(0);
    });

    it('Update user', async () => {
      const userDto: UpdateUserDto = {
        name: 'Ediano',
        email: 'ediano@gmail.com',
        password: '123456',
      };

      mockPrismaService.user.findUnique.mockReturnValueOnce(userDto);

      await usersService.update(uuid, userDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: uuid },
      });

      expect(mockPrismaService.user.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: uuid },
        data: {
          email: userDto.email,
          name: userDto.name,
          passwordHash: userDto.password,
        },
      });
    });
  });

  describe('remove', () => {
    it('User do not exists', async () => {
      mockPrismaService.user.findUnique.mockReturnValueOnce(null);

      try {
        await usersService.remove(uuid);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('User do not exists');
      }

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: uuid },
      });

      expect(mockPrismaService.user.delete).toHaveBeenCalledTimes(0);
    });

    it('Delete user', async () => {
      const userDto: CreateUserDto = {
        name: 'Ediano',
        email: 'ediano@gmail.com',
        password: '123456',
      };

      mockPrismaService.user.findUnique.mockReturnValueOnce(userDto);

      await usersService.remove(uuid);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: uuid },
      });

      expect(mockPrismaService.user.delete).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: uuid },
      });
    });
  });
});
