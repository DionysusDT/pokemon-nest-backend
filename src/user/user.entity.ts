import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@Index('uq_users_email', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', length: 320 }) email: string;
  @Column({ type: 'varchar', length: 255 }) full_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true }) role?: string;
  @Column({ type: 'varchar', length: 30, nullable: true })
  phone_number?: string;

  @Column({ type: 'boolean', default: true }) is_active: boolean;
  @Column({ type: 'timestamptz', default: () => 'now()' }) last_action_at: Date;

  @Column({ type: 'varchar', length: 128 }) password_hash: string;
  @Column({ type: 'varchar', length: 128 }) password_salt: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
