import { Injectable } from '@nestjs/common';
import { LoginRepository } from './login.repository';

@Injectable()
export class LoginService {
  constructor(private readonly repo: LoginRepository) {}

  createLogin(dto: { user_id: number; session_id: string; expiresAt: Date }) {
    return this.repo.createLogin(dto);
  }
  validateLogin(id: number) {
    return this.repo.validateLogin(id);
  }
  revokeLogin(id: number) {
    return this.repo.revoke(id);
  }
  findById(id: number) {
    return this.repo.findById(id);
  }
}
