import { Injectable } from '@nestjs/common';
import { CreateWalletTypeDto } from './dto/create-wallet_type.dto';
import { UpdateWalletTypeDto } from './dto/update-wallet_type.dto';

@Injectable()
export class WalletTypesService {
  create(createWalletTypeDto: CreateWalletTypeDto) {
    return 'This action adds a new walletType';
  }

  findAll() {
    return `This action returns all walletTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} walletType`;
  }

  update(id: number, updateWalletTypeDto: UpdateWalletTypeDto) {
    return `This action updates a #${id} walletType`;
  }

  remove(id: number) {
    return `This action removes a #${id} walletType`;
  }
}
