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
import ResponseBuilder from 'src/utils/response';
import { Role, Roles } from 'src/auth/auth.roles';
import { CategoryGroup } from './entities/category_group.entity';

@Controller('category-groups')
export class CategoryGroupsController {
  constructor(private readonly categoryGroupsService: CategoryGroupsService) {}
  private readonly responseBuilder = new ResponseBuilder<
    CategoryGroup | CategoryGroup[]
  >();

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
    return this.responseBuilder
      .code(201)
      .data(res)
      .success(true)
      .message('Created')
      .build();
  }

  @Get()
  async findAll() {
    const res = await this.categoryGroupsService.findAll();
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('ok')
      .build();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.categoryGroupsService.findOne(+id);
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('ok')
      .build();
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
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('Updated')
      .build();
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    const res = await this.categoryGroupsService.remove(+id);
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('Deleted')
      .build();
  }
}
