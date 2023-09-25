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
  ParseIntPipe,
} from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Role, Roles } from 'src/auth/auth.roles';
import { QueryDto } from 'src/query.dto';
import Response from 'src/response.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Req() req, @Body() createDto: CreateTransactionDto) {
    const res = await this.transactionsService.create(
      createDto,
      req.auth?.userId,
    );
    return new Response<Transaction>({
      code: 201,
      data: res,
      success: true,
      message: 'Created',
    });
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(@Query() query: QueryDto) {
    const { data, total } = await this.transactionsService.findAll(query);
    return new Response<Transaction[]>({
      code: 200,
      data,
      success: true,
      total: parseInt(total as string),
      took: data.length,
    });
  }

  @Get('authenticated')
  async findValidTransactions(@Req() req, @Query() query: QueryDto) {
    const { data, total } =
      await this.transactionsService.findValidTransactions(
        query,
        req.auth?.userId,
      );

    return new Response<Transaction[]>({
      code: 200,
      data,
      total: parseInt(total as string),
      took: data.length,
    });
  }

  @Get('wallet/:walletId')
  async findTransactionsByWalletId(
    @Req() req,
    @Query() query: QueryDto,
    @Param('walletId', ParseIntPipe) walletId: number,
  ) {
    const { data, total } =
      await this.transactionsService.findValidTransactionsByWalletId(
        query,
        req.auth?.userId,
        walletId,
      );

    return new Response<Transaction[]>({
      code: 200,
      data,
      success: true,
      total: parseInt(total as string),
      took: data.length,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const res = await this.transactionsService.findValidTransaction(
      +id,
      req.auth?.userId,
    );
    return new Response<Transaction>({
      code: 200,
      data: res,
      success: true,
    });
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

    return new Response<Transaction>({
      code: 200,
      data: res,
      message: 'Updated',
      success: true,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const res = await this.transactionsService.remove(+id, req.auth?.userId);
    return new Response<Transaction>({
      code: 200,
      data: res,
      message: 'Deleted',
      success: true,
    });
  }
}
