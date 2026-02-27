import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('two_factor_auth')
export class TwoFactorAuthEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'secret' })
  secret: string;

  @Column({ name: 'backup_codes', type: 'json' })
  backupCodes: string[];

  @Column({ name: 'is_enabled', type: 'boolean', default: false })
  isEnabled: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
