import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { PinoLogger } from 'nestjs-pino';
import { Public } from 'src/auth/auth.guard';
import Response from 'src/response.entity';

export interface PlaidWebhookBody {
  webhook_type: string;
  webhook_code: string;
  item_id: string;
  environment: string;
  error?: any;
  new_transactions?: number;
  removed_transactions?: string[];
  initial_update_complete?: boolean;
  historical_update_complete?: boolean;
  account_ids?: string[];
  account_id?: string;
}
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('plaid')
  @Public()
  onPlaidWebhookReceived(
    @Body()
    body: PlaidWebhookBody,
  ) {
    this.webhookService.handle(body);
    return new Response<any>({ code: 200, success: true });
  }
}
