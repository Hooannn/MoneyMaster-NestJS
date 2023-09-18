import { Module } from '@nestjs/common';
import { WalletPoliciesService } from './wallet_policies.service';
import { WalletPoliciesController } from './wallet_policies.controller';

@Module({
  controllers: [WalletPoliciesController],
  providers: [WalletPoliciesService]
})
export class WalletPoliciesModule {}
