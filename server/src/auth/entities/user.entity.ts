import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  first_name: string;

  @Column({ default: '' })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ nullable: true })
  verification_token: string;
  
  @Column({ default: 0 })
  failed_attempts: number;

  @Column({ default: false })
  account_locked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date | null;
  
  @Column({ type: 'timestamp', nullable: true })
  locked_until: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
