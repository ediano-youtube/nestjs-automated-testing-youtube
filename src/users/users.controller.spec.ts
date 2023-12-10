import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const uuid = 'eafbedbf-7783-42bf-8249-5fe9966f83c8';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('create', async () => {
    const userDto: CreateUserDto = {
      name: 'Ediano',
      email: 'ediano@gmail.com',
      password: '123456',
    };

    await usersController.create(userDto);

    expect(mockUsersService.create).toHaveBeenCalledTimes(1);
    expect(mockUsersService.create).toHaveBeenCalledWith(userDto);
  });

  it('findAll', async () => {
    await usersController.findAll();

    expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
    expect(mockUsersService.findAll).toHaveBeenCalledWith();
  });

  it('findOne', async () => {
    await usersController.findOne(uuid);

    expect(mockUsersService.findOne).toHaveBeenCalledTimes(1);
    expect(mockUsersService.findOne).toHaveBeenCalledWith(uuid);
  });

  it('update', async () => {
    const userDto: UpdateUserDto = {
      name: 'Ediano',
      email: 'ediano@gmail.com',
      password: '123456',
    };

    await usersController.update(uuid, userDto);

    expect(mockUsersService.update).toHaveBeenCalledTimes(1);
    expect(mockUsersService.update).toHaveBeenCalledWith(uuid, userDto);
  });

  it('remove', async () => {
    await usersController.remove(uuid);

    expect(mockUsersService.remove).toHaveBeenCalledTimes(1);
    expect(mockUsersService.remove).toHaveBeenCalledWith(uuid);
  });
});
