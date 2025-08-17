import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TYPEORM_API_TOKEN } from 'src/shared/modules/typeorm/api/constants';
import { TypeOrmRepository } from 'src/shared/modules/typeorm/typeorm.repository';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoriteRepository extends TypeOrmRepository<Favorite> {
  constructor(
    @InjectRepository(Favorite, TYPEORM_API_TOKEN) repo: Repository<Favorite>,
    @InjectDataSource(TYPEORM_API_TOKEN) ds: DataSource,
  ) { super(repo, ds); }

  findOneByUserPokemon(user_id: number, pokemon_id: number) {
    return this.repo.findOne({ where: { user_id, pokemon_id } });
  }

  async upsert(user_id: number, pokemon_id: number) {
    const row = this.repo.create({ user_id, pokemon_id });
    await this.repo.createQueryBuilder().insert().values(row).orIgnore().execute();
    return this.findOneByUserPokemon(user_id, pokemon_id);
  }

  async removeByUserPokemon(user_id: number, pokemon_id: number) {
    await this.repo.delete({ user_id, pokemon_id });
  }

  async listByUser(user_id: number) {
    return this.repo.find({ where: { user_id } });
  }
}
