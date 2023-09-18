import { Injectable } from '@nestjs/common';
import { CreateCategoryGroupDto } from './dto/create-category_group.dto';
import { UpdateCategoryGroupDto } from './dto/update-category_group.dto';

@Injectable()
export class CategoryGroupsService {
  create(createCategoryGroupDto: CreateCategoryGroupDto) {
    return 'This action adds a new categoryGroup';
  }

  findAll() {
    return `This action returns all categoryGroups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoryGroup`;
  }

  update(id: number, updateCategoryGroupDto: UpdateCategoryGroupDto) {
    return `This action updates a #${id} categoryGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoryGroup`;
  }
}
