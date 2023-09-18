import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletPoliciesService } from './wallet_policies.service';
import { CreateWalletPolicyDto } from './dto/create-wallet_policy.dto';
import { UpdateWalletPolicyDto } from './dto/update-wallet_policy.dto';

@Controller('wallet-policies')
export class WalletPoliciesController {
  constructor(private readonly walletPoliciesService: WalletPoliciesService) {}

  @Post()
  create(@Body() createWalletPolicyDto: CreateWalletPolicyDto) {
    return this.walletPoliciesService.create(createWalletPolicyDto);
  }

  @Get()
  findAll() {
    return this.walletPoliciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletPoliciesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletPolicyDto: UpdateWalletPolicyDto) {
    return this.walletPoliciesService.update(+id, updateWalletPolicyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletPoliciesService.remove(+id);
  }
}
