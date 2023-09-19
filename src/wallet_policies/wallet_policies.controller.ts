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
import ResponseBuilder from 'src/utils/response';
import { Role, Roles } from 'src/auth/auth.roles';

@Controller('wallet-policies')
export class WalletPoliciesController {
  constructor(private readonly walletPoliciesService: WalletPoliciesService) {}
  private readonly responseBuilder = new ResponseBuilder<
    WalletPolicy | WalletPolicy[]
  >();

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
    return this.responseBuilder
      .code(201)
      .data(res)
      .success(true)
      .message('Created')
      .build();
  }

  @Get()
  async findAll() {
    const res = await this.walletPoliciesService.findAll();
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('ok')
      .build();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.walletPoliciesService.findOne(+id);
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
    @Body() updateWalletPolicyDto: UpdateWalletPolicyDto,
  ) {
    const res = await this.walletPoliciesService.update(
      +id,
      updateWalletPolicyDto,
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
    const res = await this.walletPoliciesService.remove(+id);
    return this.responseBuilder
      .code(200)
      .data(res)
      .success(true)
      .message('Deleted')
      .build();
  }
}
