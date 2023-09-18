import { Test, TestingModule } from '@nestjs/testing';
import { CategoryGroupsService } from './category_groups.service';

describe('CategoryGroupsService', () => {
  let service: CategoryGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryGroupsService],
    }).compile();

    service = module.get<CategoryGroupsService>(CategoryGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
