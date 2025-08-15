import { Module } from '@nestjs/common';
import { OrmApiModule } from 'src/shared/modules/typeorm/api/modules';
import { Pokemon } from './pokemon.entity';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { PokemonServiceProxy } from './pokemon.service.proxy';
import { PokemonRepository } from './pokemon.repository';

@Module({
  imports: [OrmApiModule.forFeature([Pokemon])],
  providers: [
    PokemonRepository,
    PokemonService,
    ...PokemonServiceProxy.createProxy(PokemonService),
  ],
  controllers: [PokemonController],
  exports: [PokemonServiceProxy],
})
export class PokemonModule {}
