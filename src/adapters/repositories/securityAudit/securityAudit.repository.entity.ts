import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('security_audit_logs')
export class SecurityAuditEntity {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'user_id', type: 'varchar', nullable: true })
  userId: string | null;

  @Column({ name: 'event_type', type: 'varchar', length: 50 })
  eventType: string;

  @Column({ name: 'event_description', type: 'text' })
  eventDescription: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 45 })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text' })
  userAgent: string;

  @Column({ name: 'timestamp', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ name: 'severity', type: 'varchar', length: 10 })
  severity: string;

  @Column({ name: 'metadata', type: 'json', nullable: true })
  metadata: Record<string, any> | null;
}
