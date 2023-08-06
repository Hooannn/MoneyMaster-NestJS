import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectKnex, Knex } from 'nestjs-knex';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectKnex() private readonly knex: Knex,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    if (!(await this.knex.schema.hasTable('users'))) {
      await this.knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name');
      });
    }
    await this.knex.table('users').insert({ name: 'Name' });
    const users = await this.knex.table('users');
    return { users };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
