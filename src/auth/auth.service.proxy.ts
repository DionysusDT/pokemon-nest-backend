import { Inject, Injectable, Type } from '@nestjs/common';
import { AuthService } from './auth.service';

const SERVICE_TOKEN = 'AuthService';

@Injectable()
export class AuthServiceProxy {
  constructor(@Inject(SERVICE_TOKEN) public readonly service: AuthService) {}
  static createProxy(cls: Type<AuthService>) {
    return [AuthServiceProxy, { provide: SERVICE_TOKEN, useClass: cls }];
  }
}
