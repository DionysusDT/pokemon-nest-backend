import { Injectable, Inject, Type } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

const TOKEN = 'PokemonService';

@Injectable()
export class PokemonServiceProxy {
  constructor(@Inject(TOKEN) public readonly service: PokemonService) {}
  static createProxy(cls: Type<PokemonService>) {
    return [PokemonServiceProxy, { provide: TOKEN, useClass: cls }];
  }
}
