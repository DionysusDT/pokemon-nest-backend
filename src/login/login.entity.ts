import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'logins' })
@Index('idx_logins_user', ['user_id'])
@Index('idx_logins_expires_at', ['expires_at'])
export class Login {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'int' }) user_id: number;
  @Column({ type: 'varchar', length: 64 }) session_id: string;

  @Column({ type: 'timestamptz' }) expires_at: Date;
  @Column({ type: 'boolean', default: false }) revoked: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
