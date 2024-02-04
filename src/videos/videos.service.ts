import { Injectable } from '@nestjs/common';
import { CreateVideoInput } from './dto/create-video.input';
import { UpdateVideoInput } from './dto/update-video.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VideosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateVideoInput) {
    const { name, url, userId } = data;

    const video = await this.prismaService.video.create({
      data: { name, url, userId },
    });

    return video;
  }

  async findAll(userId: string) {
    const videos = await this.prismaService.video.findMany({
      where: { userId },
    });
    return videos;
  }

  async findOne(id: string) {
    const videos = await this.prismaService.video.findUnique({ where: { id } });
    return videos;
  }

  async update(data: UpdateVideoInput) {
    const video = await this.prismaService.video.update({
      where: { id: data.id },
      data,
    });
    return video;
  }

  async remove(id: string) {
    await this.prismaService.video.delete({ where: { id } });
  }

  async user(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
  }
}
