import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { User } from './user.entity';
import { TypeOrmRepository } from 'src/shared/modules/typeorm/typeorm.repository';
import { TYPEORM_API_TOKEN } from 'src/shared/modules/typeorm/api/constants';

@Injectable()
export class UserRepository extends TypeOrmRepository<User> {
  constructor(
    @InjectRepository(User, TYPEORM_API_TOKEN) repo: Repository<User>,
    @InjectDataSource(TYPEORM_API_TOKEN) ds: DataSource,
  ) {
    super(repo, ds);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  paginate(search = '', page = 1, limit = 20) {
    return this.repo.findAndCount({
      where: search ? { full_name: ILike(`%${search}%`) } : {},
      take: limit,
      skip: (page - 1) * limit,
      order: { updated_at: 'DESC' },
    });
  }
}
