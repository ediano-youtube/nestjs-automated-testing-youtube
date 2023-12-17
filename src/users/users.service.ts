import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const user = await this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        passwordHash: createUserDto.password,
      },
    });

    await this.emailService.send(user);

    return user;
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new HttpException('User do not exists', HttpStatus.NOT_FOUND);
    }

    const user = await this.prismaService.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        passwordHash: updateUserDto.password,
      },
    });

    return user;
  }

  async remove(id: string) {
    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new HttpException('User do not exists', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.user.delete({ where: { id } });
  }
}
