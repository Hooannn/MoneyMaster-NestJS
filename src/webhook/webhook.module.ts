import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { WalletsModule } from 'src/wallets/wallets.module';
import { PlaidModule } from 'src/plaid/plaid.module';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [WalletsModule, PlaidModule],
})
export class WebhookModule {}
