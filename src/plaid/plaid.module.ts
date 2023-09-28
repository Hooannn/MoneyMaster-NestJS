import { Module } from '@nestjs/common';
import { PlaidService } from './plaid.service';
import { PlaidController } from './plaid.controller';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import config from 'src/configs';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PlaidController],
  providers: [
    PlaidService,
    {
      provide: 'PLAID',
      useFactory: () => {
        const PLAID_CLIENT_ID = config.PLAID_CLIENT_ID;
        const PLAID_SECRET =
          config.PLAID_SANDBOX_SECRET ?? config.PLAID_DEVELOPMENT_SECRET;
        const PLAID_ENV = config.PLAID_ENV || 'sandbox';
        const configuration = new Configuration({
          basePath: PlaidEnvironments[PLAID_ENV],
          baseOptions: {
            headers: {
              'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
              'PLAID-SECRET': PLAID_SECRET,
              'Plaid-Version': '2020-09-14',
            },
          },
        });

        const client = new PlaidApi(configuration);
        return client;
      },
    },
  ],
  exports: ['PLAID', PlaidService],
})
export class PlaidModule {}
