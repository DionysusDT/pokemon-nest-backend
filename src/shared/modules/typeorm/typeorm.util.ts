import { FindManyOptions, FindOptionsOrder } from 'typeorm';

export const ASC = 'asc';
export const DESC = 'desc';

export type ResultQueryDto = {
  page?: number | string;
  limit?: number | string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
};

export const parsePaginationOptions = <T = any>(
  dto: ResultQueryDto,
): Pick<FindManyOptions<T>, 'skip' | 'take' | 'order'> => {
  const page = Math.max(Number(dto.page) || 1, 1);
  const take = Math.max(Number(dto.limit) || 20, 1);
  const skip = (page - 1) * take;

  let order: FindOptionsOrder<T> | undefined;
  if (dto.sort_by) {
    const dir = (dto.sort_order || DESC).toLowerCase() === ASC ? 'ASC' : 'DESC';
    order = { [dto.sort_by as string]: dir } as any;
  } else {
    order = { ['created_at' as any]: 'DESC' } as any;
  }

  return { skip, take, order };
};

export const parseValueTypes = (value: any) => {
  const n = Number(value);
  const number = Number.isNaN(n) ? null : n;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const uuid =
    typeof value === 'string' && uuidRegex.test(value) ? value : null;

  return { number, uuid };
};

export const toILike = (s?: string) => (s ? `%${s}%` : '%');
