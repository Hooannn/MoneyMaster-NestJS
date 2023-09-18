import { Module } from '@nestjs/common';
import { WalletTypesService } from './wallet_types.service';
import { WalletTypesController } from './wallet_types.controller';

@Module({
  controllers: [WalletTypesController],
  providers: [WalletTypesService]
})
export class WalletTypesModule {}
