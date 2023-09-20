import { DefaultEntity } from '../../../src/shared/entity';

export class WalletPolicy extends DefaultEntity {
  readonly description?: string;
  readonly name: string;
}
