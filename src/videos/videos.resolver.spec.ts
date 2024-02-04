import { Test, TestingModule } from '@nestjs/testing';
import { VideosResolver } from './videos.resolver';
import { VideosService } from './videos.service';

describe('VideosResolver', () => {
  let resolver: VideosResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideosResolver, VideosService],
    }).compile();

    resolver = module.get<VideosResolver>(VideosResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
