import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'password_resets' })
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  reset_token: string;

  @Column()
  expires_at: Date;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn()
  created_at: Date;
}