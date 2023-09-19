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
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import ResponseBuilder from 'src/utils/response';
import { Role, Roles } from 'src/auth/auth.roles';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}
  private readonly responseBuilder = new ResponseBuilder<Wallet | Wallet[]>();

  @Post()
  @Roles(Role.Admin)
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
  async findAll() {
    const res = await this.walletsService.findAll();
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('ok')
      .build();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.walletsService.findOne(+id);
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
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    const res = await this.walletsService.remove(+id);
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('Deleted')
      .build();
  }
}
