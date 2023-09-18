import { Injectable } from '@nestjs/common';
import { CreateWalletPolicyDto } from './dto/create-wallet_policy.dto';
import { UpdateWalletPolicyDto } from './dto/update-wallet_policy.dto';

@Injectable()
export class WalletPoliciesService {
  create(createWalletPolicyDto: CreateWalletPolicyDto) {
    return 'This action adds a new walletPolicy';
  }

  findAll() {
    return `This action returns all walletPolicies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} walletPolicy`;
  }

  update(id: number, updateWalletPolicyDto: UpdateWalletPolicyDto) {
    return `This action updates a #${id} walletPolicy`;
  }

  remove(id: number) {
    return `This action removes a #${id} walletPolicy`;
  }
}
