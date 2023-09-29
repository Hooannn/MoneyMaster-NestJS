import { Body, Controller, Post, Req } from '@nestjs/common';
import { PlaidService } from './plaid.service';
import Response from 'src/response.entity';
import {
  ItemPublicTokenExchangeResponse,
  LinkTokenCreateResponse,
} from 'plaid';
import { SetAccessTokenDto } from './dto/set-access-token.dto';

@Controller('plaid')
export class PlaidController {
  constructor(private readonly plaidService: PlaidService) {}

  @Post('create_link_token')
  async createLinkToken(@Req() req) {
    const res = await this.plaidService.createLinkToken(req.auth?.userId);

    return new Response<LinkTokenCreateResponse>({
      code: 201,
      message: 'Created',
      success: true,
      data: res,
    });
  }

  @Post('set_access_token')
  async setAccessToken(
    @Body() setAccessTokenDto: SetAccessTokenDto,
    @Req() req,
  ) {
    const res = await this.plaidService.setAccessToken(
      setAccessTokenDto,
      req.auth?.userId,
    );

    return new Response<ItemPublicTokenExchangeResponse>({
      code: 201,
      message: 'Created',
      success: true,
      data: res,
    });
  }
}
