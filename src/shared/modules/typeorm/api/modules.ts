import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmApiProvider } from './provider';
import { TYPEORM_API_TOKEN } from './constants';

@Module({
  imports: [TypeOrmModule.forRootAsync(OrmApiProvider)],
})
export class OrmApiModule {
  static forFeature(entities: any[] | any): DynamicModule {
    const castArray = (x: any) => (Array.isArray(x) ? x : [x]);
    return TypeOrmModule.forFeature(castArray(entities), TYPEORM_API_TOKEN);
  }
}
