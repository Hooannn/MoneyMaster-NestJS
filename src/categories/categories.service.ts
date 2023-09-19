import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createCategoryDto: CreateCategoryDto, createdBy: number) {
    try {
      const [res] = await this.knex<Category>('categories').insert(
        {
          ...createCategoryDto,
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
      const res = await this.knex<Category>('categories').select();
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.knex<Category>('categories')
        .where('id', id)
        .first();

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    updatedBy: number,
  ) {
    try {
      const [res] = await this.knex<Category>('categories')
        .where('id', id)
        .update({ ...updateCategoryDto, updated_by: updatedBy }, '*');

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const [res] = await this.knex<Category>('categories')
        .where('id', id)
        .del('*');
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
