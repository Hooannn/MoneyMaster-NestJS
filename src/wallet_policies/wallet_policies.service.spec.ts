import { Test, TestingModule } from '@nestjs/testing';
import { WalletPoliciesService } from './wallet_policies.service';

describe('WalletPoliciesService', () => {
  let service: WalletPoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletPoliciesService],
    }).compile();

    service = module.get<WalletPoliciesService>(WalletPoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
