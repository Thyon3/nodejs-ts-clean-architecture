import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('email_verification')
export class EmailVerificationEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'token' })
  token: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
