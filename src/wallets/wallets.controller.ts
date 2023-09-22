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
import { WalletsService } from './wallets.service';
import { AdminCreateWalletDto, CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { Role, Roles } from 'src/auth/auth.roles';
import { QueryDto } from 'src/query.dto';
import Response from 'src/response.entity';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  async create(@Req() req, @Body() createDto: CreateWalletDto) {
    const res = await this.walletsService.create(createDto, req.auth?.userId);

    return new Response<Wallet>({
      code: 201,
      data: res,
      success: true,
      message: 'Created',
    });
  }

  @Post('admin')
  @Roles(Role.Admin)
  async adminCreate(@Req() req, @Body() createDto: AdminCreateWalletDto) {
    const res = await this.walletsService.adminCreate(
      createDto,
      req.auth?.userId,
    );

    return new Response<Wallet>({
      code: 201,
      data: res,
      success: true,
      message: 'Created',
    });
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(@Query() query: QueryDto) {
    const { data, total } = await this.walletsService.findAll(query);
    return new Response<Wallet[]>({
      code: 200,
      data,
      total: parseInt(total as string),
      took: data.length,
      success: true,
    });
  }

  @Get('authenticated')
  async findAllValidWallets(@Req() req, @Query() query: QueryDto) {
    const { data, total } = await this.walletsService.findAllValidWallets(
      query,
      req.auth?.userId,
    );

    return new Response<Wallet[]>({
      code: 200,
      data,
      total: parseInt(total as string),
      took: data.length,
      success: true,
    });
  }

  @Get('admin/:id')
  @Roles(Role.Admin)
  async findOne(@Param('id') id: string) {
    const res = await this.walletsService.findOne(+id);

    return new Response<Wallet>({
      code: 200,
      data: res,
      success: true,
    });
  }

  @Get(':id')
  async findValidWallet(@Param('id') id: string, @Req() req) {
    const res = await this.walletsService.findValidWallet(
      +id,
      req.auth?.userId,
    );

    return new Response<Wallet>({
      code: 200,
      data: res,
      success: true,
    });
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateWalletDto,
  ) {
    const res = await this.walletsService.update(
      +id,
      updateDto,
      req.auth?.userId,
    );

    return new Response<Wallet>({
      code: 200,
      data: res,
      success: true,
      message: 'Updated',
    });
  }

  @Patch('admin/:id')
  @Roles(Role.Admin)
  async adminUpdate(
    @Req() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateWalletDto,
  ) {
    const res = await this.walletsService.adminUpdate(
      +id,
      updateDto,
      req.auth?.userId,
    );

    return new Response<Wallet>({
      code: 200,
      data: res,
      success: true,
      message: 'Updated',
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const res = await this.walletsService.remove(+id, req.auth?.userId);
    return new Response<Wallet>({
      code: 200,
      data: res,
      success: true,
      message: 'Deleted',
    });
  }

  @Delete('admin/:id')
  async adminRemove(@Param('id') id: string) {
    const res = await this.walletsService.adminRemove(+id);
    return new Response<Wallet>({
      code: 200,
      data: res,
      success: true,
      message: 'Deleted',
    });
  }
}
