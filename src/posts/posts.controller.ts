import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import ResponseBuilder from 'src/utils/response';
import { Post as IPost } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  private responseBuilder = new ResponseBuilder<IPost>();
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const post = await this.postsService.create(createPostDto);
    return this.responseBuilder
      .code(201)
      .success(true)
      .data(post)
      .message('Created')
      .build();
  }

  @Get()
  async findAll() {
    const posts = await this.postsService.findAll();
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(posts)
      .message('ok')
      .build();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findOne(+id);
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(post)
      .message('ok')
      .build();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const updatedRecord = await this.postsService.update(+id, updatePostDto);
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(updatedRecord)
      .message('Updated')
      .build();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedRecord = await this.postsService.remove(+id);
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(deletedRecord)
      .message('Deleted')
      .build();
  }
}
