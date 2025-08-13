import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { TYPEORM_API_TOKEN } from './constants';

export const OrmApiProvider: TypeOrmModuleAsyncOptions = {
  name: TYPEORM_API_TOKEN,
  inject: [ConfigService],
  useFactory: async (cfg: ConfigService) => {
    const url =
      process.env.DATABASE_URL ||
      cfg.get<string>('DATABASE_URL') ||
      cfg.get<string>('typeorm.api.url');

    const isProd =
      (process.env.NODE_ENV || cfg.get('NODE_ENV') || 'development') ===
      'production';

    const logging = cfg.get<boolean>('typeorm.api.logging', false);
    const ssl = cfg.get<boolean>('typeorm.api.ssl', false);

    return {
      type: 'postgres' as const,
      url,
      name: TYPEORM_API_TOKEN,
      autoLoadEntities: true,
      synchronize: !isProd,
      logging,
      ssl: ssl ? { rejectUnauthorized: false } : false,
      extra: { keepAlive: true, max: 10 },
    };
  },
};
