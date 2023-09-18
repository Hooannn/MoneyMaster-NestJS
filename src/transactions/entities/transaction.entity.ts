import { DefaultEntity } from 'src/shared/entity';

export class Transaction extends DefaultEntity {
  readonly description?: string;
  readonly wallet_id: number;
  readonly category_id: number;
  readonly amount_in_usd: number;
  readonly transacted_at: string;
}
