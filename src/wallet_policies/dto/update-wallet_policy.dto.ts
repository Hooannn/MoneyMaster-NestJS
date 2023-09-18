import { PartialType } from '@nestjs/swagger';
import { CreateWalletPolicyDto } from './create-wallet_policy.dto';

export class UpdateWalletPolicyDto extends PartialType(CreateWalletPolicyDto) {}
