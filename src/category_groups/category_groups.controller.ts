import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CategoryGroupsService } from './category_groups.service';
import { CreateCategoryGroupDto } from './dto/create-category_group.dto';
import { UpdateCategoryGroupDto } from './dto/update-category_group.dto';
import { Role, Roles } from 'src/auth/auth.roles';
import { CategoryGroup } from './entities/category_group.entity';
import Response from 'src/response.entity';

@Controller('category-groups')
export class CategoryGroupsController {
  constructor(private readonly categoryGroupsService: CategoryGroupsService) {}

  @Post()
  @Roles(Role.Admin)
  async create(
    @Req() req,
    @Body() createCategoryGroupDto: CreateCategoryGroupDto,
  ) {
    const res = await this.categoryGroupsService.create(
      createCategoryGroupDto,
      req.auth?.userId,
    );

    return new Response<CategoryGroup>({
      code: 200,
      data: res,
      success: true,
      message: 'Created',
    });
  }

  @Get()
  async findAll() {
    const res = await this.categoryGroupsService.findAll();

    return new Response<CategoryGroup[]>({
      code: 200,
      data: res,
      success: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.categoryGroupsService.findOne(+id);

    return new Response<CategoryGroup>({
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
    @Body() updateCategoryGroupDto: UpdateCategoryGroupDto,
  ) {
    const res = await this.categoryGroupsService.update(
      +id,
      updateCategoryGroupDto,
      req.auth?.userId,
    );

    return new Response<CategoryGroup>({
      code: 200,
      data: res,
      success: true,
      message: 'Updated',
    });
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    const res = await this.categoryGroupsService.remove(+id);

    return new Response<CategoryGroup>({
      code: 200,
      data: res,
      success: true,
      message: 'Deleted',
    });
  }
}
