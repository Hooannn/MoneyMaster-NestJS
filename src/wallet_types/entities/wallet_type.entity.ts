import { DefaultEntity } from '../../../src/shared/entity';

export class WalletType extends DefaultEntity {
  readonly description?: string;
  readonly name: string;
  readonly policy_id: number;
}
