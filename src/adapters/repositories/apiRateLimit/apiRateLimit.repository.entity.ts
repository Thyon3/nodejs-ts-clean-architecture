import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('api_rate_limits')
export class ApiRateLimitEntity {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'endpoint', type: 'varchar', length: 255 })
  endpoint: string;

  @Column({ name: 'request_count', type: 'int', default: 0 })
  requestCount: number;

  @Column({ name: 'window_start', type: 'timestamp' })
  windowStart: Date;

  @Column({ name: 'window_end', type: 'timestamp' })
  windowEnd: Date;

  @Column({ name: 'limit', type: 'int' })
  limit: number;

  @Column({ name: 'window_ms', type: 'bigint' })
  windowMs: number;
}
