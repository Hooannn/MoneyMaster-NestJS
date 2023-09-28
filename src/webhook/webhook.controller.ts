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

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly logger: PinoLogger,
  ) {}

  @Post('plaid')
  @Public()
  onPlaidWebhookReceived(@Body() body) {
    this.logger.info(
      '================================================Webhook received================================================',
    );
    this.logger.info({ body });
    return new Response<any>({ code: 200, success: true });
  }
}
