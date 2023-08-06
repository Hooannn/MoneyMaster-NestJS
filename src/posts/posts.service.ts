import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class PostsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async create(createPostDto: CreatePostDto) {
    try {
      const post = await this.knex.table('posts').insert(createPostDto);
      return post;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findAll() {
    try {
      const posts = await this.knex.table('posts');
      return posts;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findOne(id: number) {
    try {
      const post = await this.knex
        .table('posts')
        .select('*')
        .where({ id })
        .first();
      return post;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const updatedRecord = await this.knex
        .table('posts')
        .where({ id })
        .update(updatePostDto);
      return updatedRecord;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async remove(id: number) {
    try {
      const deletedRecord = await this.knex
        .table('posts')
        .where({ id })
        .delete();
      return deletedRecord;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
