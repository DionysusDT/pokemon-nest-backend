import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, DeepPartial } from 'typeorm';
import { Login } from './login.entity';
import { TYPEORM_API_TOKEN } from 'src/shared/modules/typeorm/api/constants';
import { TypeOrmRepository } from 'src/shared/modules/typeorm/typeorm.repository';

@Injectable()
export class LoginRepository extends TypeOrmRepository<Login> {
  constructor(
    @InjectRepository(Login, TYPEORM_API_TOKEN) repo: Repository<Login>,
    @InjectDataSource(TYPEORM_API_TOKEN) ds: DataSource,
  ) {
    super(repo, ds);
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  createLogin(data: { user_id: number; session_id: string; expiresAt: Date }) {
    const entity = this.create({
      user_id: data.user_id,
      session_id: data.session_id,
      expires_at: data.expiresAt,
    } as DeepPartial<Login>);
    return this.save(entity);
  }

  async validateLogin(id: number) {
    const row = await this.findById(id);
    const now = new Date();
    if (!row || row.revoked || row.expires_at <= now) {
      throw new UnauthorizedException('Login expired or revoked');
    }
    return row;
  }

  async revoke(id: number) {
    await this.save({ id, revoked: true } as DeepPartial<Login>);
    return { ok: true };
  }
}
