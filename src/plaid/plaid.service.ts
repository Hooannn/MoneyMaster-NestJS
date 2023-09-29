import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CountryCode, LinkTokenCreateRequest, PlaidApi, Products } from 'plaid';
import config from 'src/configs';
import { UsersService } from 'src/users/users.service';
import { SetAccessTokenDto } from './dto/set-access-token.dto';
import { PinoLogger } from 'nestjs-pino';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';

@Injectable()
export class PlaidService {
  constructor(
    @Inject('PLAID') private readonly plaidClient: PlaidApi,
    private readonly usersService: UsersService,
    private readonly logger: PinoLogger,
    @InjectKnex() private readonly knex: Knex,
  ) {}
  public static WEBHOOK_URL = 'https://moneymaster.onrender.com/webhook/plaid';
  public static PLAID_PRODUCTS = (
    config.PLAID_PRODUCTS || Products.Transactions
  ).split(',') as Products[];

  public static PLAID_COUNTRY_CODES = (
    config.PLAID_COUNTRY_CODES || 'US'
  ).split(',') as CountryCode[];

  public static PLAID_REDIRECT_URI = config.PLAID_REDIRECT_URI || '';

  async createLinkToken(userId: number) {
    try {
      const user = await this.usersService.findOne(userId);
      const configs: LinkTokenCreateRequest = {
        user: {
          client_user_id: userId.toString(),
          email_address: user.email,
          legal_name: `${user.last_name} ${user.first_name}`,
        },
        client_name: 'Money Master',
        products: PlaidService.PLAID_PRODUCTS,
        country_codes: PlaidService.PLAID_COUNTRY_CODES,
        language: 'en',
        webhook: PlaidService.WEBHOOK_URL,
      };

      if (PlaidService.PLAID_REDIRECT_URI !== '') {
        configs.redirect_uri = PlaidService.PLAID_REDIRECT_URI;
      }

      const createTokenResponse = await this.plaidClient.linkTokenCreate(
        configs,
      );

      return createTokenResponse.data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async setAccessToken(setAccessTokenDto: SetAccessTokenDto, userId: number) {
    try {
      const tokenResponse = await this.plaidClient.itemPublicTokenExchange({
        public_token: setAccessTokenDto.public_token,
      });
      const accessToken = tokenResponse.data.access_token;
      const itemId = tokenResponse.data.item_id;

      await this.knex('plaid_provider').insert({
        item_id: itemId,
        access_token: accessToken,
        user_id: userId,
      });

      delete tokenResponse.data.access_token;
      delete tokenResponse.data.item_id;
      return tokenResponse.data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
