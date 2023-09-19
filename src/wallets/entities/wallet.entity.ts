import { DefaultEntity } from 'src/shared/entity';

export class Wallet extends DefaultEntity {
  readonly name: string;
  readonly description?: string;
  readonly custom_image?: string;
  readonly currency_code?: string;
  readonly is_active?: boolean;
  readonly amount_in_usd: number;
  readonly wallet_type_id: number;
  readonly wallet_policy_id: number;
  readonly belongs_to: number;
}
