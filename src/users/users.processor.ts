import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PinoLogger } from 'nestjs-pino';
import { WalletsService } from 'src/wallets/wallets.service';
import { User } from './entities/user.entity';

@Processor('users')
export class UsersConsumer {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly logger: PinoLogger,
  ) {}

  private async createDefaultWallet(userId: number) {
    return await this.walletsService.create(
      {
        name: 'Default wallet',
        description: "This is a default user's wallet",
        amount_in_usd: 0,
        wallet_policy_id: 1,
        wallet_type_id: 1,
        belongs_to: userId,
      },
      userId,
    );
  }

  @Process('user.updated')
  async onUserUpdated(job: Job<{ object: User }>) {
    const userId = job.data?.object?.id;
    if (!userId) {
      this.logger.warn(
        `@Process('user.updated') User id not provided in job: ${job.id}`,
      );
      return;
    }
    const haveAnyWallets = await this.walletsService.findOneUserWallet(userId);
    if (!haveAnyWallets) {
      this.logger.warn(
        `@Process('user.updated') User does not have any wallets. Create a new one`,
      );

      this.createDefaultWallet(userId);
    }
  }

  @Process('user.created')
  async onUserCreated(job: Job<{ object: User }>) {
    const userId = job.data?.object?.id;
    if (!userId) {
      this.logger.warn(
        `@Process('user.created') User id not provided in job: ${job.id}. Raw: ${job.data}`,
      );
      return;
    }
    this.logger.info(
      `@Process('user.created') User does not have any wallets. Create a new one`,
    );
    this.createDefaultWallet(userId);
  }
}
