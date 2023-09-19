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
import { WalletTypesService } from './wallet_types.service';
import { CreateWalletTypeDto } from './dto/create-wallet_type.dto';
import { UpdateWalletTypeDto } from './dto/update-wallet_type.dto';
import { WalletType } from './entities/wallet_type.entity';
import ResponseBuilder from 'src/utils/response';
import { Role, Roles } from 'src/auth/auth.roles';

@Controller('wallet-types')
export class WalletTypesController {
  constructor(private readonly walletTypesService: WalletTypesService) {}
  private readonly responseBuilder = new ResponseBuilder<
    WalletType | WalletType[]
  >();

  @Post()
  @Roles(Role.Admin)
  async create(@Req() req, @Body() createWalletTypeDto: CreateWalletTypeDto) {
    const res = await this.walletTypesService.create(
      createWalletTypeDto,
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
    const res = await this.walletTypesService.findAll();
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('ok')
      .build();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.walletTypesService.findOne(+id);
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
    @Body() updateWalletTypeDto: UpdateWalletTypeDto,
  ) {
    const res = await this.walletTypesService.update(
      +id,
      updateWalletTypeDto,
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
    const res = await this.walletTypesService.remove(+id);
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('Deleted')
      .build();
  }
}
