import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {
  Knex as KnexModule,
  bootstrapDatabase,
  dropDatabase,
} from './database';
import { NotificationsModule } from './notifications/notifications.module';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { MailerModule } from '@nestjs-modules/mailer';
import config from './configs';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { InjectKnex, Knex } from 'nestjs-knex';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { CategoryGroupsModule } from './category_groups/category_groups.module';
import { WalletPoliciesModule } from './wallet_policies/wallet_policies.module';
import { WalletTypesModule } from './wallet_types/wallet_types.module';
import { FilesModule } from './files/files.module';
import { BullModule } from '@nestjs/bull';
import { sleep } from './utils/sleep';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: config.REDIS_HOST,
        port: parseInt(config.REDIS_PORT),
        password: config.REDIS_PASSWORD,
      },
    }),
    UsersModule,
    KnexModule,
    NotificationsModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    AuthModule,
    JwtModule.register({
      global: false,
      secret: config.JWT_AUTH_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    RedisModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: config.GMAIL_USER,
          pass: config.GMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '<noreply@moneymaster.com>',
      },
    }),
    WalletsModule,
    TransactionsModule,
    CategoriesModule,
    CategoryGroupsModule,
    WalletPoliciesModule,
    WalletTypesModule,
    FilesModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  MAX_TRY_COUNT = 10;
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private readonly logger: PinoLogger,
  ) {}

  private async createDB() {
    await bootstrapDatabase(this.knex, this.logger);
    this.logger.info('End bootstrapping database');
  }

  private async dropDB() {
    try {
      await dropDatabase(this.knex, this.logger);
    } catch (error) {
      if (this.MAX_TRY_COUNT < 0) {
        this.logger.error(`Dropping database failed: `, error);
        return;
      }
      this.logger.warn(
        `Failed to drop full database retry in 5 seconds...Try left: ${this.MAX_TRY_COUNT}`,
      );
      await sleep(5000);
      this.dropDB();
      this.MAX_TRY_COUNT--;
    }
  }

  async onModuleInit() {
    //await this.createDB();
    //await this.dropDB();
  }
}
