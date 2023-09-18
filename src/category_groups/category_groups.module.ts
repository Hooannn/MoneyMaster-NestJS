import { Module } from '@nestjs/common';
import { CategoryGroupsService } from './category_groups.service';
import { CategoryGroupsController } from './category_groups.controller';

@Module({
  controllers: [CategoryGroupsController],
  providers: [CategoryGroupsService]
})
export class CategoryGroupsModule {}
