import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { VideosService } from './videos.service';
import { Video } from './entities/video.entity';
import { CreateVideoInput } from './dto/create-video.input';
import { UpdateVideoInput } from './dto/update-video.input';
import { User } from '../users/entities/user.entity';

@Resolver(() => Video)
export class VideosResolver {
  constructor(private readonly videosService: VideosService) {}

  @Mutation(() => Video, { name: 'createVideo', nullable: true })
  async create(@Args('data') data: CreateVideoInput) {
    return this.videosService.create(data);
  }

  @Query(() => [Video], { name: 'findAllVideos', nullable: true })
  async findAll(@Args('userId', { type: () => ID }) userId: string) {
    return this.videosService.findAll(userId);
  }

  @Query(() => Video, { name: 'findOneVideo', nullable: true })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.videosService.findOne(id);
  }

  @Mutation(() => Video, { name: 'updateVideo', nullable: true })
  async update(@Args('data') data: UpdateVideoInput) {
    return this.videosService.update(data);
  }

  @Mutation(() => Video, { name: 'deleteVideo', nullable: true })
  async remove(@Args('id', { type: () => ID }) id: string) {
    return this.videosService.remove(id);
  }

  @ResolveField('user', () => User)
  async user(@Parent() video: Video) {
    return this.videosService.user(video.userId);
  }
}
