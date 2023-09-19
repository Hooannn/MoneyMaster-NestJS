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
import { hashSync } from 'bcrypt';
import config from 'src/configs';
import { ChangePasswordDto } from './dto/change-password.dto';
@Controller('users')
export class UsersController {
  private readonly responseBuilder = new ResponseBuilder<User | User[]>();
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = hashSync(
      createUserDto.password,
      parseInt(config.SALTED_PASSWORD),
    );
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

  @Patch('/profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const authUser = req.auth;
    const userId = authUser?.userId;
    if (!userId) throw new HttpException('Unknown user', HttpStatus.FORBIDDEN);
    delete updateUserDto.email;
    delete updateUserDto.roles;
    delete updateUserDto.password;
    const user = await this.usersService.update(userId, updateUserDto);
    return this.responseBuilder
      .code(200)
      .success(true)
      .message('Updated')
      .data(user)
      .build();
  }

  @Patch('/profile/password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const authUser = req.auth;
    const userId = authUser?.userId;
    if (!userId) throw new HttpException('Unknown user', HttpStatus.FORBIDDEN);
    const user = await this.usersService.changePassword(
      userId,
      changePasswordDto,
    );
    return this.responseBuilder
      .code(200)
      .success(true)
      .message('Updated')
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
    if (updateUserDto.password) {
      updateUserDto.password = hashSync(
        updateUserDto.password,
        parseInt(config.SALTED_PASSWORD),
      );
    }
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
