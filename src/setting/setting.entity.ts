import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'settings' })
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'jsonb' as any })
  value: any;
}
