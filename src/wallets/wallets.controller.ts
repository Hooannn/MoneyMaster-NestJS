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
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import ResponseBuilder from 'src/utils/response';
import { Role, Roles } from 'src/auth/auth.roles';
import { QueryDto } from 'src/query.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}
  private readonly responseBuilder = new ResponseBuilder<Wallet | Wallet[]>();

  @Post()
  async create(@Req() req, @Body() createDto: CreateWalletDto) {
    const res = await this.walletsService.create(createDto, req.auth?.userId);
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
    const res = await this.walletsService.findAll();
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('ok')
      .build();
  }

  @Get('authenticated')
  async findAllValidWallets(@Req() req, @Query() query: QueryDto) {
    const res = await this.walletsService.findAllValidWallets(
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
    const res = await this.walletsService.findValidWallet(
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
    @Body() updateDto: UpdateWalletDto,
  ) {
    const res = await this.walletsService.update(
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
    const res = await this.walletsService.remove(+id, req.auth?.userId);
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('Deleted')
      .build();
  }
}
