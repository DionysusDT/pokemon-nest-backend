import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import type { File as MulterFile } from 'multer';

import { PokemonRepository } from './pokemon.repository';
import { Pokemon } from './pokemon.entity';
import { PokemonQueryDto } from './dto/pokemon.query.dto';

type CsvRow = {
  id?: string;
  name: string;
  type1: string;
  type2?: string;
  total?: string;
  hp?: string;
  attack?: string;
  defense?: string;
  spAttack?: string;
  spDefense?: string;
  speed?: string;
  generation?: string;
  legendary?: string;
  image?: string;
  ytbUrl?: string;
};

@Injectable()
export class PokemonService {
  constructor(private readonly repo: PokemonRepository) {}

  async importCsv(file: MulterFile) {
    if (!file) throw new BadRequestException('CSV file is required');
    const text = file.buffer.toString('utf8').replace(/^\uFEFF/, '') ?? '';
    if (!text.trim()) throw new BadRequestException('Empty file');

    const rows = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CsvRow[];
    if (!rows.length)
      return { totalRows: 0, afterDedup: 0, inserted: 0, skipped: 0 };

    const norm = (s?: string) => (s ?? '').trim();
    const toInt = (v?: string) => (v?.trim() ? Number(v) : undefined);
    const toBool = (v?: string) =>
      String(v ?? '')
        .trim()
        .toLowerCase() === 'true';
    const normType = (s?: string) => (s ? s.trim().toLowerCase() : '');
    const typeKey = (t1: string, t2: string) =>
      !t2 ? t1 : [t1, t2].sort().join('|');

    const seen = new Set<string>();
    const payload: Partial<Pokemon>[] = [];

    for (const r of rows) {
      const name = norm(r.name);
      const t1 = norm(r.type1);
      const t2 = norm(r.type2) || null;
      if (!name || !t1) continue;

      const key = `${name.toLowerCase()}__${typeKey(normType(t1), normType(t2 || undefined))}`;
      if (seen.has(key)) continue;
      seen.add(key);

      payload.push({
        name,
        type1: t1,
        type2: t2,
        total: toInt(r.total),
        hp: toInt(r.hp),
        attack: toInt(r.attack),
        defense: toInt(r.defense),
        spAttack: toInt(r.spAttack),
        spDefense: toInt(r.spDefense),
        speed: toInt(r.speed),
        generation: toInt(r.generation),
        legendary: toBool(r.legendary),
        image: norm(r.image),
        ytbUrl: norm(r.ytbUrl),
      });
    }

    const inserted = await this.repo.insertBulkIgnore(payload);

    return {
      totalRows: rows.length,
      afterDedup: payload.length,
      inserted,
      skipped: rows.length - inserted,
    };
  }

  list(q: PokemonQueryDto) {
    return this.repo.list(q);
  }

  async detail(id: number) {
    const row = await this.repo.findById(id);
    if (!row) throw new NotFoundException('Pokemon not found');
    return row;
  }
}
