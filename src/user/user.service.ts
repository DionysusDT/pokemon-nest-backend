import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  create(data: Partial<User>) {
    return this.repo.save(this.repo.create(data));
  }
  findByEmail(email: string) {
    return this.repo.findByEmail(email);
  }

  async validateUser(id: number) {
    const row = await this.repo.findOne({ id } as any);
    if (!row || !row.is_active)
      throw new NotFoundException('User not found/inactive');
    return row;
  }

  updateLastAction(id: number, at: Date) {
    return this.repo.save({ id, last_action_at: at } as any);
  }
}
