import { DefaultEntity } from 'src/shared/entity';

export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}
export class Category extends DefaultEntity {
  readonly description?: string;
  readonly name: string;
  readonly group_id: number;
  readonly transaction_type: TransactionType;
}
