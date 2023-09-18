import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletTypesService } from './wallet_types.service';
import { CreateWalletTypeDto } from './dto/create-wallet_type.dto';
import { UpdateWalletTypeDto } from './dto/update-wallet_type.dto';

@Controller('wallet-types')
export class WalletTypesController {
  constructor(private readonly walletTypesService: WalletTypesService) {}

  @Post()
  create(@Body() createWalletTypeDto: CreateWalletTypeDto) {
    return this.walletTypesService.create(createWalletTypeDto);
  }

  @Get()
  findAll() {
    return this.walletTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletTypeDto: UpdateWalletTypeDto) {
    return this.walletTypesService.update(+id, updateWalletTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletTypesService.remove(+id);
  }
}
