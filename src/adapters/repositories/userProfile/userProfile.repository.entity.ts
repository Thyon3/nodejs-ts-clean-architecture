import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('user_profiles')
export class UserProfileEntity {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'avatar', type: 'text', nullable: true })
  avatar: string | null;

  @Column({ name: 'bio', type: 'text', nullable: true })
  bio: string | null;

  @Column({ name: 'timezone', type: 'varchar', length: 50, default: 'UTC' })
  timezone: string;

  @Column({ name: 'language', type: 'varchar', length: 10, default: 'en' })
  language: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({ name: 'address_street', type: 'varchar', length: 255, nullable: true })
  addressStreet: string | null;

  @Column({ name: 'address_city', type: 'varchar', length: 100, nullable: true })
  addressCity: string | null;

  @Column({ name: 'address_state', type: 'varchar', length: 100, nullable: true })
  addressState: string | null;

  @Column({ name: 'address_country', type: 'varchar', length: 100, nullable: true })
  addressCountry: string | null;

  @Column({ name: 'address_postal_code', type: 'varchar', length: 20, nullable: true })
  addressPostalCode: string | null;

  @Column({ name: 'email_notifications', type: 'boolean', default: true })
  emailNotifications: boolean;

  @Column({ name: 'sms_notifications', type: 'boolean', default: false })
  smsNotifications: boolean;

  @Column({ name: 'marketing_emails', type: 'boolean', default: false })
  marketingEmails: boolean;

  @Column({ name: 'theme', type: 'varchar', length: 10, default: 'auto' })
  theme: string;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
