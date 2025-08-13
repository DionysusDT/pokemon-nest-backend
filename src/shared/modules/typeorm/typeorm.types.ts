import { FindOptionsWhere } from 'typeorm';

export type EntityType<T> = T & {
  id: string;
  created_at?: Date;
  updated_at?: Date;
};

export type EntityFilter<T> = FindOptionsWhere<T>;
export type EntityUpdate<T> = Partial<T>;
