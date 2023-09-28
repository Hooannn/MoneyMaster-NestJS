import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CountryCode,
  LinkTokenCreateRequest,
  PaymentAmountCurrency,
  PlaidApi,
  Products,
} from 'plaid';
import config from 'src/configs';
import { UsersService } from 'src/users/users.service';
import { SetAccessTokenDto } from './dto/set-access-token.dto';

@Injectable()
export class PlaidService {
  constructor(
    @Inject('PLAID') private readonly plaidClient: PlaidApi,
    private readonly usersService: UsersService,
  ) {}

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
        webhook: 'https://moneymaster.onrender.com/webhook/plaid',
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

  async createLinkTokenForPayment(userId: number) {
    try {
      const createRecipientResponse =
        await this.plaidClient.paymentInitiationRecipientCreate({
          name: 'Harry Potter',
          iban: 'GB33BUKB20201555555555',
          address: {
            street: ['4 Privet Drive'],
            city: 'Little Whinging',
            postal_code: '11111',
            country: 'GB',
          },
        });
      const recipientId = createRecipientResponse.data.recipient_id;

      const createPaymentResponse =
        await this.plaidClient.paymentInitiationPaymentCreate({
          recipient_id: recipientId,
          reference: 'paymentRef',
          amount: {
            value: 1.23,
            currency: 'GBP' as PaymentAmountCurrency,
          },
        });
      const paymentId = createPaymentResponse.data.payment_id;

      const configs: LinkTokenCreateRequest = {
        client_name: 'Money Master',
        user: {
          client_user_id: userId.toString(),
        },
        country_codes: PlaidService.PLAID_COUNTRY_CODES,
        language: 'en',
        products: [Products.PaymentInitiation],
        payment_initiation: {
          payment_id: paymentId,
        },
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
      if (PlaidService.PLAID_PRODUCTS.includes(Products.Transfer)) {
        //const transfer = await authorizeAndCreateTransfer(accessToken);
      }

      delete tokenResponse.data.access_token;
      return tokenResponse.data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
