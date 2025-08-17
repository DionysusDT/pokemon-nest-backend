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

    let rows: CsvRow[];
    try {
      rows = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }) as CsvRow[];
    } catch (e: any) {
      throw new BadRequestException(
        `Invalid CSV: ${e?.message || 'cannot parse'}`
      );
    }

    if (!rows.length) {
      return { totalRows: 0, afterDedup: 0, inserted: 0, skipped: 0 };
    }

    const requiredHeaders = ['name', 'type1', 'type2', 'total', 'hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed', 'generation', 'legendary', 'image', 'ytbUrl'];
    const headers = Object.keys(rows[0] || {});
    const missing = requiredHeaders.filter((h) => !headers.includes(h));
    if (missing.length) {
      throw new BadRequestException(
        `Invalid CSV headers: missing ${missing.join(', ')}`
      );
    }

    const norm = (s?: string) => (s ?? '').trim();
    const parseNum = (v?: string) => {
      if (!v?.trim()) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : NaN;
    };
    const parseBoolStrict = (v?: string) => {
      const s = String(v ?? '').trim().toLowerCase();
      if (s === '') return undefined;
      if (s === 'true') return true;
      if (s === 'false') return false;
      return 'INVALID';
    };
    const normType = (s?: string) => (s ? s.trim().toLowerCase() : '');
    const typeKey = (t1: string, t2: string) =>
      !t2 ? t1 : [t1, t2].sort().join('|');

    const errors: string[] = [];
    const seen = new Set<string>();
    const payload: Partial<Pokemon>[] = [];

    rows.forEach((r, idx) => {
      const line = idx + 2;
      const name = norm(r.name);
      const t1 = norm(r.type1);
      const t2 = norm(r.type2) || null;

      if (!name) errors.push(`Line ${line}: "name" is required`);
      if (!t1) errors.push(`Line ${line}: "type1" is required`);

      const total = parseNum(r.total);
      const hp = parseNum(r.hp);
      const attack = parseNum(r.attack);
      const defense = parseNum(r.defense);
      const spAttack = parseNum(r.spAttack);
      const spDefense = parseNum(r.spDefense);
      const speed = parseNum(r.speed);
      const generation = parseNum(r.generation);

      const legendary = parseBoolStrict(r.legendary);
      if (legendary === 'INVALID') {
        errors.push(
          `Line ${line}: "legendary" must be boolean (true/false)`
        );
      }

      ([
        ['total', total],
        ['hp', hp],
        ['attack', attack],
        ['defense', defense],
        ['spAttack', spAttack],
        ['spDefense', spDefense],
        ['speed', speed],
        ['generation', generation],
      ] as const).forEach(([k, v]) => {
        if (v !== undefined && Number.isNaN(v)) {
          errors.push(`Line ${line}: "${k}" must be a number`);
        }
      });

      if (!name || !t1) return;

      const key = `${name.toLowerCase()}__${typeKey(
        normType(t1),
        normType(t2 || undefined)
      )}`;
      if (seen.has(key)) return;
      seen.add(key);

      payload.push({
        name,
        type1: t1,
        type2: t2,
        total: Number.isFinite(total as number) ? (total as number) : undefined,
        hp: Number.isFinite(hp as number) ? (hp as number) : undefined,
        attack: Number.isFinite(attack as number)
          ? (attack as number)
          : undefined,
        defense: Number.isFinite(defense as number)
          ? (defense as number)
          : undefined,
        spAttack: Number.isFinite(spAttack as number)
          ? (spAttack as number)
          : undefined,
        spDefense: Number.isFinite(spDefense as number)
          ? (spDefense as number)
          : undefined,
        speed: Number.isFinite(speed as number) ? (speed as number) : undefined,
        generation: Number.isFinite(generation as number)
          ? (generation as number)
          : undefined,
        legendary:
          legendary === 'INVALID'
            ? undefined
            : (legendary as boolean | undefined),
        image: norm(r.image),
        ytbUrl: norm(r.ytbUrl),
      });
    });

    if (errors.length) {
      throw new BadRequestException(
        `CSV format error:\n${errors.join('\n')}`,
      );
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
