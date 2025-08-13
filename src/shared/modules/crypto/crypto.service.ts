import { Injectable, Scope } from '@nestjs/common';
import Jwt from 'jsonwebtoken';
import Crypto from 'crypto';
import Util from 'util';

import type {
  IJwtSignOptions,
  IJwtVerifyOptions,
  TJwtSignFunction,
  TJwtVerifyFunction,
} from './interfaces/jwt.interface';

const pbkdf2 = Util.promisify(Crypto.pbkdf2);
const randomBytes = Util.promisify(Crypto.randomBytes);
const jwtSign = Util.promisify(Jwt.sign) as unknown as TJwtSignFunction;
const jwtVerify = Util.promisify(Jwt.verify) as unknown as TJwtVerifyFunction;

@Injectable({ scope: Scope.TRANSIENT })
export class CryptoService {
  constructor() {}

  async jwtEncrypt(payload: object, options: IJwtSignOptions) {
    return await jwtSign(payload, options.secret, {
      expiresIn: options.expiresIn,
    });
  }

  async jwtVerify<T>(
    token: string,
    options: IJwtVerifyOptions,
  ): Promise<T | null> {
    try {
      const result = await jwtVerify(token, options.secret);

      return result as T;
    } catch {
      return null;
    }
  }

  async hashPassword(password: string, salt: string) {
    const hashedBuffer = await pbkdf2(password, salt, 100000, 64, 'sha512');

    return hashedBuffer.toString('hex');
  }

  async generateSalt() {
    const buffer = await randomBytes(32);

    return buffer.toString('hex');
  }
}
