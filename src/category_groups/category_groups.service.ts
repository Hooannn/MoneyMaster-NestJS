import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryGroupDto } from './dto/create-category_group.dto';
import { UpdateCategoryGroupDto } from './dto/update-category_group.dto';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CategoryGroup } from './entities/category_group.entity';

@Injectable()
export class CategoryGroupsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(
    createCategoryGroupDto: CreateCategoryGroupDto,
    createdBy: number,
  ) {
    try {
      const [res] = await this.knex<CategoryGroup>('category_groups').insert(
        {
          ...createCategoryGroupDto,
          updated_by: createdBy,
          created_by: createdBy,
        },
        '*',
      );
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const res = await this.knex<CategoryGroup>('category_groups').select();
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.knex<CategoryGroup>('category_groups')
        .where('id', id)
        .first();

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: number,
    updateCategoryGroupDto: UpdateCategoryGroupDto,
    updatedBy: number,
  ) {
    try {
      const [res] = await this.knex<CategoryGroup>('category_groups')
        .where('id', id)
        .update({ ...updateCategoryGroupDto, updated_by: updatedBy }, '*');

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const [res] = await this.knex<CategoryGroup>('category_groups')
        .where('id', id)
        .del('*');
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
