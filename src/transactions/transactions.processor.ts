import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PinoLogger } from 'nestjs-pino';
import { WalletsService } from 'src/wallets/wallets.service';
import { Transaction } from './entities/transaction.entity';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

@Processor('transactions')
export class TransactionsConsumer {
  constructor(
    private readonly walletsService: WalletsService,
    @InjectKnex() private readonly knex: Knex,
    private readonly logger: PinoLogger,
  ) {}

  @Process('transaction.updated')
  async onTransactionUpdated(job: Job<{ object: Transaction }>) {
    this.logger.info('transaction.updated', job.data);
  }

  @Process('transaction.created')
  async onTransactionCreated(job: Job<{ object: Transaction }>) {
    this.logger.info('transaction.created', job.data);
  }
}
