import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Role, Roles } from 'src/auth/auth.roles';
import Response from 'src/response.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Req() req, @Body() createCategoryDto: CreateCategoryDto) {
    const res = await this.categoriesService.create(
      createCategoryDto,
      req.auth?.userId,
    );
    return new Response<Category>({
      code: 201,
      data: res,
      success: true,
      message: 'Created',
    });
  }

  @Get()
  async findAll() {
    const res = await this.categoriesService.findAll();

    return new Response<Category[]>({
      code: 200,
      data: res,
      success: true,
    });
  }

  @Get('/category_groups/:categoryGroupId')
  async findCategoriesByGroup(
    @Param('categoryGroupId', ParseIntPipe) categoryGroupId: number,
  ) {
    const res = await this.categoriesService.findCategoriesByGroup(
      categoryGroupId,
    );

    return new Response<Category[]>({
      code: 200,
      data: res,
      success: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.categoriesService.findOne(+id);
    return new Response<Category>({
      code: 200,
      data: res,
      success: true,
    });
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const res = await this.categoriesService.update(
      +id,
      updateCategoryDto,
      req.auth?.userId,
    );

    return new Response<Category>({
      code: 200,
      data: res,
      success: true,
      message: 'Updated',
    });
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    const res = await this.categoriesService.remove(+id);

    return new Response<Category>({
      code: 200,
      data: res,
      success: true,
      message: 'Deleted',
    });
  }
}
