import { Role } from 'src/auth/auth.roles';

export class User {
  readonly id: string;
  readonly email: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly roles: Role[];
  readonly created_at?: string;
  readonly updated_at?: string;
  readonly avatar?: string;
}
