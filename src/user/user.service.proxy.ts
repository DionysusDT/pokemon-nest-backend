import { Inject, Injectable, Type } from '@nestjs/common';
import { UserService } from './user.service';

const TOKEN = 'UserService';

@Injectable()
export class UserServiceProxy {
  constructor(@Inject(TOKEN) public readonly service: UserService) {}
  static createProxy(cls: Type<UserService>) {
    return [UserServiceProxy, { provide: TOKEN, useClass: cls }];
  }
}
