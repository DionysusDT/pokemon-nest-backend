import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, ObjectLiteral } from 'typeorm';
import { TYPEORM_API_TOKEN } from './constants';
import { TypeOrmRepository } from '../typeorm.repository';

export class OrmApiRepository<
  T extends ObjectLiteral,
> extends TypeOrmRepository<T> {
  static CONNECTION_TOKEN = TYPEORM_API_TOKEN;

  constructor(entity: Function, repo: Repository<T>, ds: DataSource) {
    super(repo, ds);
  }
}
