import {
  DataSource,
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  ObjectLiteral,
  DeepPartial,
} from 'typeorm';

export abstract class TypeOrmRepository<T extends ObjectLiteral> {
  constructor(
    protected readonly repo: Repository<T>,
    protected readonly ds: DataSource,
  ) {}

  create(data: DeepPartial<T>): T {
    return this.repo.create(data);
  }

  save(entity: DeepPartial<T>): Promise<T>;
  save(entity: DeepPartial<T>[]): Promise<T[]>;
  save(entity: DeepPartial<T> | DeepPartial<T>[]): Promise<T | T[]> {
    return this.repo.save(entity as any);
  }

  findOne(where: FindOptionsWhere<T>) {
    return this.repo.findOne({ where });
  }

  findAndCount(opts: FindManyOptions<T>) {
    return this.repo.findAndCount(opts);
  }

  delete(where: FindOptionsWhere<T>) {
    return this.repo.delete(where);
  }

  withTransaction<R>(fn: (trx: EntityManager) => Promise<R>) {
    return this.ds.transaction<R>(fn);
  }
}
