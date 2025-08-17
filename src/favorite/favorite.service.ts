import { Injectable } from '@nestjs/common';
import { FavoriteRepository } from './favorite.repository';

@Injectable()
export class FavoriteService {
  constructor(private readonly repo: FavoriteRepository) {}

  async isFavorite(userId: number, pokemonId: number) {
    return !!(await this.repo.findOneByUserPokemon(userId, pokemonId));
  }

  async setFavorite(userId: number, pokemonId: number) {
    await this.repo.upsert(userId, pokemonId);
    return { favorite: true };
  }

  async unsetFavorite(userId: number, pokemonId: number) {
    await this.repo.removeByUserPokemon(userId, pokemonId);
    return { favorite: false };
  }
}
