import type { Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

export interface IJwtSignOptions {
  expiresIn?: StringValue | number;
  secret: string;
}

export interface IJwtVerifyOptions {
  secret: string;
}

export type TJwtSignFunction = (
  payload: string | Buffer | object,
  secret: Secret,
  options: SignOptions,
) => Promise<string>;

export type TJwtVerifyFunction = (
  token: string,
  secretOrPublicKey: Secret,
  options?: VerifyOptions & { complete: true },
) => Promise<string>;
