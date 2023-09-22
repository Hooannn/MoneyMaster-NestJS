import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import ResponseBuilder from 'src/utils/response';
import { Role, Roles } from 'src/auth/auth.roles';
import { QueryDto } from 'src/query.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  private readonly responseBuilder = new ResponseBuilder<
    Transaction | Transaction[]
  >();

  @Delete()
  @Roles(Role.Admin)
  async clear() {
    await this.transactionsService.clear();
    return this.responseBuilder
      .code(200)
      .data(null)
      .success(true)
      .message('Done')
      .build();
  }

  @Post()
  async create(@Req() req, @Body() createDto: CreateTransactionDto) {
    const res = await this.transactionsService.create(
      createDto,
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
  @Roles(Role.Admin)
  async findAll() {
    const res = await this.transactionsService.findAll();
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('ok')
      .build();
  }

  @Get('authenticated')
  async findAllValidTransactions(@Req() req, @Query() query: QueryDto) {
    const res = await this.transactionsService.findAllValidTransactions(
      query,
      req.auth?.userId,
    );
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('ok')
      .build();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const res = await this.transactionsService.findValidTransaction(
      +id,
      req.auth?.userId,
    );
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('ok')
      .build();
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateTransactionDto,
  ) {
    const res = await this.transactionsService.update(
      +id,
      updateDto,
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
  async remove(@Param('id') id: string, @Req() req) {
    const res = await this.transactionsService.remove(+id, req.auth?.userId);
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('Deleted')
      .build();
  }
}
