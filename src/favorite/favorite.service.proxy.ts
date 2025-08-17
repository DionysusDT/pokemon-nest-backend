import { Inject, Injectable, Type } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

const SERVICE_TOKEN = 'FavoriteService';

@Injectable()
export class FavoriteServiceProxy {
  constructor(@Inject(SERVICE_TOKEN) public readonly service: FavoriteService) {}

  static createProxy(cls: Type<FavoriteService>) {
    return [FavoriteServiceProxy, { provide: SERVICE_TOKEN, useClass: cls }];
  }
}
