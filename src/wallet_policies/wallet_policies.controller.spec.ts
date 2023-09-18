import { Test, TestingModule } from '@nestjs/testing';
import { WalletPoliciesController } from './wallet_policies.controller';
import { WalletPoliciesService } from './wallet_policies.service';

describe('WalletPoliciesController', () => {
  let controller: WalletPoliciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletPoliciesController],
      providers: [WalletPoliciesService],
    }).compile();

    controller = module.get<WalletPoliciesController>(WalletPoliciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
