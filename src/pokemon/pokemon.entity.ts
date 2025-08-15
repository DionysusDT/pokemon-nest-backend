import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pokemons' })
@Index('uq_pokemons_name_type', ['name_key', 'type_key'], { unique: true })
export class Pokemon {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', length: 160 }) name: string;
  @Column({ type: 'varchar', length: 30 }) type1: string;
  @Column({ type: 'varchar', length: 30, nullable: true }) type2?:
    | string
    | null;
  @Column({ type: 'int', nullable: true }) total?: number;
  @Column({ type: 'int', nullable: true }) hp?: number;
  @Column({ type: 'int', nullable: true }) attack?: number;
  @Column({ type: 'int', nullable: true }) defense?: number;
  @Column({ type: 'int', nullable: true }) spAttack?: number;
  @Column({ type: 'int', nullable: true }) spDefense?: number;
  @Column({ type: 'int', nullable: true }) speed?: number;
  @Column({ type: 'int', nullable: true }) generation?: number;
  @Column({ type: 'boolean', default: false }) legendary: boolean;
  @Column({ type: 'varchar', length: 500, nullable: true }) image?: string;
  @Column({ type: 'varchar', length: 500, nullable: true }) ytbUrl?: string;
  @Column({
    type: 'varchar',
    length: 160,
    asExpression: 'lower(name)',
    generatedType: 'STORED',
    select: false,
  })
  name_key: string;
  @Column({
    type: 'varchar',
    length: 64,
    asExpression: `CASE
      WHEN COALESCE(type2, '') = '' THEN lower(type1)
      ELSE LEAST(lower(type1), lower(type2)) || '|' || GREATEST(lower(type1), lower(type2))
    END`,
    generatedType: 'STORED',
    select: false,
  })
  type_key: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
