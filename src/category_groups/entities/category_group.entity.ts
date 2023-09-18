import { DefaultEntity } from 'src/shared/entity';

export class CategoryGroup extends DefaultEntity {
  readonly description?: string;
  readonly name: string;
}
