import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import ResponseBuilder from 'src/utils/response';
import { User } from './entities/user.entity';
import { Role, Roles } from 'src/auth/auth.roles';
@Controller('users')
export class UsersController {
  private readonly responseBuilder = new ResponseBuilder<User | User[]>();
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.responseBuilder
      .code(201)
      .success(true)
      .data(user)
      .message('Created')
      .build();
  }

  @Get()
  @Roles(Role.Admin)
  async findAll() {
    const users = await this.usersService.findAll();
    return this.responseBuilder
      .code(200)
      .success(true)
      .message('ok')
      .data(users)
      .build();
  }

  @Get('/profile')
  async findAuthenticatedUser(@Request() req) {
    const authUser = req.auth;
    const userId = authUser?.userId;
    if (!userId) throw new HttpException('Unknown user', HttpStatus.FORBIDDEN);
    const user = await this.usersService.findOne(userId);
    return this.responseBuilder
      .code(200)
      .success(true)
      .message('ok')
      .data(user)
      .build();
  }

  @Get(':id')
  @Roles(Role.Admin)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return this.responseBuilder
      .code(200)
      .success(true)
      .message('ok')
      .data(user)
      .build();
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedRecord = await this.usersService.update(+id, updateUserDto);
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(updatedRecord)
      .message('Updated')
      .build();
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    const record = await this.usersService.remove(+id);
    return this.responseBuilder
      .code(200)
      .success(true)
      .message('Deleted')
      .data(record)
      .build();
  }
}
