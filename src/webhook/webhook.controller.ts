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

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('transactions/auth')
  onTransactionAdded(@Body() body) {
    console.log(body);
    return 'ok';
  }

  @Post('transactions/refund')
  onTransactionRefunded(@Body() body) {
    console.log(body);
    return 'ok';
  }

  @Post('cards/linked')
  linkCard(@Body() body) {
    console.log(body);
    return 'ok';
  }

  @Post('cards/failed')
  removeLinkedCard(@Body() body) {
    console.log(body);
    return 'ok';
  }
}
