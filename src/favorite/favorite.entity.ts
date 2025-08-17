import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'favorites' })
@Unique('uq_fav_user_pokemon', ['user_id', 'pokemon_id'])
export class Favorite {
    @PrimaryGeneratedColumn() id: number;

    @Column({ type: 'int' }) user_id: number;

    @Column({ type: 'int' }) pokemon_id: number;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    created_at: Date;
    
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updated_at: Date;
}