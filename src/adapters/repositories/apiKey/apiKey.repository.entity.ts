import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('api_keys')
export class ApiKeyEntity {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'key_hash', type: 'varchar', length: 64 })
  keyHash: string;

  @Column({ name: 'permissions', type: 'json' })
  permissions: string[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({ name: 'last_used_at', type: 'timestamp', nullable: true })
  lastUsedAt: Date | null;

  @Column({ name: 'usage_count', type: 'int', default: 0 })
  usageCount: number;

  @Column({ name: 'rate_limit_per_hour', type: 'int', default: 1000 })
  rateLimitPerHour: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
