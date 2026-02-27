import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('user_sessions')
export class SessionEntity {
  @PrimaryColumn({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'device_info' })
  deviceInfo: string;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'user_agent' })
  userAgent: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'last_accessed_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastAccessedAt: Date;
}
