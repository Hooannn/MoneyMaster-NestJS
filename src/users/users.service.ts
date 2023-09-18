import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectKnex, Knex } from 'nestjs-knex';
import { Role } from 'src/auth/auth.roles';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  private SELECTED_COLUMNS: [
    'id',
    'first_name',
    'last_name',
    'avatar',
    'email',
    'roles',
    'created_at',
    'updated_at',
  ] = [
    'id',
    'first_name',
    'last_name',
    'avatar',
    'email',
    'roles',
    'created_at',
    'updated_at',
  ];

  async checkUser(params: { email: string }) {
    try {
      const user = await this.knex<User>('users')
        .select('first_name', 'last_name', 'id', 'email')
        .where('email', params.email)
        .first();
      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const defaultRoles: Role[] = [Role.User];
      const [user] = await this.knex<User>('users').insert(
        { ...createUserDto, roles: defaultRoles },
        this.SELECTED_COLUMNS,
      );
      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findAll() {
    try {
      const users = await this.knex<User>('users')
        .column(this.SELECTED_COLUMNS)
        .select();
      return users;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.knex<User>('users')
        .column(this.SELECTED_COLUMNS)
        .select()
        .where('id', id)
        .first();
      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.knex<User>('users')
        .column(this.SELECTED_COLUMNS)
        .select()
        .where({ email })
        .first();
      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findPassword(email: string) {
    try {
      const user = await this.knex<User>('users')
        .select('id', 'password')
        .where({ email })
        .first();
      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async update(id: number, updateUserDto: Partial<UpdateUserDto>) {
    try {
      const [updatedRecord] = await this.knex<User>('users')
        .where('id', id)
        .update(updateUserDto, this.SELECTED_COLUMNS);
      return updatedRecord;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async remove(id: number) {
    try {
      const [deletedRecord] = await this.knex<User>('users')
        .where('id', id)
        .delete(this.SELECTED_COLUMNS);
      return deletedRecord;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
