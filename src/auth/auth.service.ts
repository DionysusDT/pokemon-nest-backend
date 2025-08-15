import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginCreateDto } from './dto/login.create.dto';
import { UserServiceProxy } from '../user/user.service.proxy';
import { LoginServiceProxy } from '../login/login.service.proxy';
import { AuthRole } from './enums/role.enum';
import { CryptoService } from 'src/shared/modules/crypto/crypto.service';
import { IAuthJwtPayload } from './interfaces/jwt-payload.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly crypto: CryptoService,
    private readonly userProxy: UserServiceProxy,
    private readonly loginProxy: LoginServiceProxy,
  ) {}

  private async generateJwtToken(payload: IAuthJwtPayload) {
    const secret = process.env.AUTH_TOKEN_SECRET!;
    const expiresIn = Number(process.env.AUTH_TOKEN_EXPIRES || 86400);
    const access_token = await this.crypto.jwtEncrypt(payload, {
      secret,
      expiresIn,
    });
    return {
      access_token,
      access_token_expiry: new Date(Date.now() + expiresIn * 1000),
    };
  }

  private verifyJwtToken(token: string) {
    return this.crypto.jwtVerify<IAuthJwtPayload>(token, {
      secret: process.env.AUTH_TOKEN_SECRET!,
    });
  }

  async signup(email: string, full_name: string, password: string) {
    const existing = await this.userProxy.service.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');

    const salt = await this.crypto.generateSalt();
    const password_hash = await this.crypto.hashPassword(password, salt);

    const user = await this.userProxy.service.create({
      email,
      full_name,
      is_active: true,
      role: AuthRole.ADMIN,
      password_hash,
      password_salt: salt,
      last_action_at: new Date(),
    });

    return { id: user.id, email: user.email };
  }

  async createLogin(dto: LoginCreateDto) {
    const user = await this.userProxy.service.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const hash = await this.crypto.hashPassword(
      dto.password,
      user.password_salt,
    );
    if (hash !== user.password_hash)
      throw new UnauthorizedException('Invalid credentials');

    await this.userProxy.service.updateLastAction(user.id, new Date());

    const login = await this.loginProxy.service.createLogin({
      user_id: user.id,
      session_id: uuidv4(),
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });

    const tokenInfo = await this.generateJwtToken({
      user_id: user.id,
      login_id: login.id,
    });
    return { ...user, ...tokenInfo, login_id: login.id };
  }

  async introspectToken(token: string) {
    const payload = await this.verifyJwtToken(token);
    if (!payload) throw new UnauthorizedException('Invalid token');

    const [login, user] = await Promise.all([
      this.loginProxy.service.validateLogin(payload.login_id),
      this.userProxy.service.validateUser(payload.user_id),
    ]);
    return { login, user };
  }

  async logout(loginId: number) {
    await this.loginProxy.service.revokeLogin(loginId);
  }
}
