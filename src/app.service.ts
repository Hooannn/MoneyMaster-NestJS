import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Role } from './auth/auth.roles';
import config from './configs';

@Injectable()
export class AppService {
  constructor(private readonly authService: AuthService) {}

  healthCheck(): string {
    return 'ok';
  }

  async getDevelopmentCredentials(payload: {
    jwt_access_secret: string;
    jwt_refresh_secret: string;
  }) {
    if (
      payload.jwt_access_secret !== config.ACCESS_TOKEN_SECRET ||
      payload.jwt_refresh_secret !== config.REFRESH_TOKEN_SECRET
    ) {
      throw new ForbiddenException();
    }
    return await this.authService.getCredentials(1, [Role.Admin, Role.User]);
  }
}
