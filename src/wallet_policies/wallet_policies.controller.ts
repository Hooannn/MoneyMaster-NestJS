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
import { WalletPoliciesService } from './wallet_policies.service';
import { CreateWalletPolicyDto } from './dto/create-wallet_policy.dto';
import { UpdateWalletPolicyDto } from './dto/update-wallet_policy.dto';
import { WalletPolicy } from './entities/wallet_policy.entity';
import { Role, Roles } from 'src/auth/auth.roles';
import Response from 'src/response.entity';

@Controller('wallet-policies')
export class WalletPoliciesController {
  constructor(private readonly walletPoliciesService: WalletPoliciesService) {}

  @Post()
  @Roles(Role.Admin)
  async create(
    @Req() req,
    @Body() createWalletPolicyDto: CreateWalletPolicyDto,
  ) {
    const res = await this.walletPoliciesService.create(
      createWalletPolicyDto,
      req.auth?.userId,
    );

    return new Response<WalletPolicy>({
      code: 201,
      message: 'Created',
      success: true,
      data: res,
    });
  }

  @Get()
  async findAll() {
    const res = await this.walletPoliciesService.findAll();

    return new Response<WalletPolicy[]>({
      code: 200,
      success: true,
      data: res,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.walletPoliciesService.findOne(+id);

    return new Response<WalletPolicy>({
      code: 200,
      success: true,
      data: res,
    });
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWalletPolicyDto: UpdateWalletPolicyDto,
  ) {
    const res = await this.walletPoliciesService.update(
      +id,
      updateWalletPolicyDto,
      req.auth?.userId,
    );

    return new Response<WalletPolicy>({
      code: 200,
      success: true,
      data: res,
      message: 'Updated',
    });
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    const res = await this.walletPoliciesService.remove(+id);
    return new Response<WalletPolicy>({
      code: 200,
      success: true,
      data: res,
      message: 'Deleted',
    });
  }
}
