import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, DeepPartial, Repository } from 'typeorm';

import { Pokemon } from './pokemon.entity';
import { PokemonQueryDto } from './dto/pokemon.query.dto';
import { TYPEORM_API_TOKEN } from 'src/shared/modules/typeorm/api/constants';
import { TypeOrmRepository } from 'src/shared/modules/typeorm/typeorm.repository';

@Injectable()
export class PokemonRepository extends TypeOrmRepository<Pokemon> {
  constructor(
    @InjectRepository(Pokemon, TYPEORM_API_TOKEN) repo: Repository<Pokemon>,
    @InjectDataSource(TYPEORM_API_TOKEN) ds: DataSource,
  ) {
    super(repo, ds);
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  existById(id: number) {
    return this.repo.findOne({ where: { id } }).then((result) => !!result);
  }

  async insertBulkIgnore(rows: DeepPartial<Pokemon>[]) {
    if (!rows?.length) return 0;
    let inserted = 0;
    const chunk = 500;
    for (let i = 0; i < rows.length; i += chunk) {
      const batch = rows.slice(i, i + chunk);
      const res = await this.repo
        .createQueryBuilder()
        .insert()
        .values(batch)
        .orIgnore()
        .execute();
      inserted += res.identifiers?.length ?? 0;
    }
    return inserted;
  }

  async list(q: PokemonQueryDto) {
    const page = Math.max(Number(q.page || 1), 1);
    const limit = Math.max(Number(q.limit || 20), 1);
    const qb = this.repo.createQueryBuilder('p');

    if (q.search?.trim()) {
      qb.andWhere('LOWER(p.name) LIKE :kw', {
        kw: `%${q.search.trim().toLowerCase()}%`,
      });
    }

    if (q.type?.trim()) {
      const tp = q.type.trim().toLowerCase();
      qb.andWhere(
        new Brackets((b) => {
          b.where('LOWER(p.type1) = :tp', { tp }).orWhere(
            'LOWER(p.type2) = :tp',
            { tp },
          );
        }),
      );
    }

    if (typeof q.legendary === 'string') {
      qb.andWhere('p.legendary = :lg', { lg: q.legendary === 'true' });
    }

    if (q.speedMin || q.speedMax) {
      const min = Number(q.speedMin || 0);
      const max = Number(q.speedMax || 99999);
      qb.andWhere('COALESCE(p.speed,0) BETWEEN :min AND :max', { min, max });
    }

    const sortBy = ['name', 'created_at', 'speed', 'total'].includes(
      q.sort_by || '',
    )
      ? q.sort_by!
      : 'created_at';
    const sortDir =
      (q.sort_order || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`p.${sortBy}`, sortDir as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { page, limit, total, items };
  }
}
