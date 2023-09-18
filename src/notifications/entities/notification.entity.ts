import { DefaultEntity } from 'src/shared/entity';

export class Notification extends DefaultEntity {
  readonly user_id: number;
  readonly message: string;
  readonly read: boolean;
}
