import { Injectable, Inject, Type } from '@nestjs/common';
import { SettingService } from './setting.service';

const TOKEN = 'SettingService';

@Injectable()
export class SettingServiceProxy {
  constructor(@Inject(TOKEN) public readonly service: SettingService) {}

  static createProxy(cls: Type<SettingService>) {
    return [SettingServiceProxy, { provide: TOKEN, useClass: cls }];
  }
}
