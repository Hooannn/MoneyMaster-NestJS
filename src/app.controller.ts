import { Controller, ForbiddenException, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/auth.guard';
import config from './configs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  healthCheck(): string {
    return this.appService.healthCheck();
  }

  @Public()
  @Get('/development/credentials')
  async getDevelopmentCredentials(
    @Query() payload: { jwt_access_secret: string; jwt_refresh_secret: string },
  ) {
    if (config.NODE_ENV === 'production') {
      throw new ForbiddenException();
    }
    return await this.appService.getDevelopmentCredentials(payload);
  }
}
