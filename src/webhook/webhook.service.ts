import { Inject, Injectable } from '@nestjs/common';
import { PlaidWebhookBody } from './webhook.controller';
import { WalletsService } from 'src/wallets/wallets.service';
import { PlaidApi } from 'plaid';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
interface PlaidItem {
  item_id: string;
  user_id: number;
  access_token: string;
}
@Injectable()
export class WebhookService {
  constructor(
    private readonly walletsService: WalletsService,
    @Inject('PLAID') private readonly plaidClient: PlaidApi,
    @InjectKnex() private readonly knex: Knex,
  ) {}
  async handle(body: PlaidWebhookBody) {
    switch (body.webhook_type) {
      case 'TRANSACTIONS':
        this.handleTransactionsWebhook(body);
        break;
      case 'AUTH':
        break;
      default:
        break;
    }
  }

  private async handleTransactionsWebhook(body: PlaidWebhookBody) {
    const itemId = body.item_id;
    const plaidItem = await this.knex<PlaidItem>('plaid_provider')
      .select('item_id', 'user_id', 'access_token')
      .where('item_id', itemId)
      .first();

    switch (body.webhook_code) {
      case 'SYNC_UPDATES_AVAILABLE':
        break;
      case 'INITIAL_UPDATE':
        const accountsResponse = await this.plaidClient.accountsGet({
          access_token: plaidItem.access_token,
        });
        const plaidAccounts = accountsResponse.data?.accounts;
        await this.walletsService.createPlaidWallets(
          plaidAccounts,
          plaidItem.user_id,
        );
        break;
      case 'DEFAULT_UPDATE':
        break;
      case 'TRANSACTIONS_REMOVED':
        break;
    }
  }
}
