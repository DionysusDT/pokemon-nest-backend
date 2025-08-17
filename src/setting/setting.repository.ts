import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Setting } from './setting.entity';
import { TypeOrmRepository } from 'src/shared/modules/typeorm/typeorm.repository';
import { TYPEORM_API_TOKEN } from 'src/shared/modules/typeorm/api/constants';

@Injectable()
export class SettingRepository extends TypeOrmRepository<Setting> {
  constructor(
    @InjectRepository(Setting, TYPEORM_API_TOKEN) repo: Repository<Setting>,
    @InjectDataSource(TYPEORM_API_TOKEN) ds: DataSource,
  ) {
    super(repo, ds);
  }

  findByKey(key: string) {
    return this.repo.findOne({ where: { key } });
  }

  async upsert(key: string, value: any) {
    let row = await this.findByKey(key);
    if (!row) {
      row = this.repo.create({ key, value });
    } else {
      row.value = value;
    }
    await this.repo.save(row);
    return row;
  }
}
