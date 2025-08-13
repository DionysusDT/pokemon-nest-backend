import { Inject, Injectable, Type } from '@nestjs/common';
import { LoginService } from './login.service';

const TOKEN = 'LoginService';

@Injectable()
export class LoginServiceProxy {
  constructor(@Inject(TOKEN) public readonly service: LoginService) {}
  static createProxy(cls: Type<LoginService>) {
    return [LoginServiceProxy, { provide: TOKEN, useClass: cls }];
  }
}
