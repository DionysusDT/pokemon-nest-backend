import { Injectable, NotFoundException } from '@nestjs/common';
import { POKEMON_KEY } from './enum/setting.enum';
import { SettingRepository } from './setting.repository';
import { PokemonConfigCreateDto } from './dto/setting,create.dto';

@Injectable()
export class SettingService {
  constructor(private readonly repo: SettingRepository) {}

  async getPokemonConfig(): Promise<PokemonConfigCreateDto> {
    const row = await this.repo.findByKey(POKEMON_KEY);
    if (!row) throw new NotFoundException('pokemonConfig not found');
    return row.value as PokemonConfigCreateDto;
  }

  async upsertPokemonConfig(body: PokemonConfigCreateDto): Promise<PokemonConfigCreateDto> {
    const saved = await this.repo.upsert(POKEMON_KEY, body);
    return saved.value as PokemonConfigCreateDto;
  }
}
