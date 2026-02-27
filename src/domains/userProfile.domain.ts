// User profile domain interface
interface IUserProfileDomain {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  timezone: string;
  language: string;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User profile domain class
class UserProfileDomain implements IUserProfileDomain {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  timezone: string;
  language: string;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(userId: string, firstName: string, lastName: string) {
    const crypto = require('crypto');
    this.id = crypto.randomUUID();
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.timezone = 'UTC';
    this.language = 'en';
    this.preferences = {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      theme: 'auto',
    };
    this.isCompleted = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Get full name
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  // Update profile
  updateProfile(updates: Partial<Omit<IUserProfileDomain, 'id' | 'userId' | 'createdAt'>>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date();
    this.checkCompletion();
  }

  // Check if profile is complete
  checkCompletion(): void {
    const requiredFields = [
      this.firstName,
      this.lastName,
      this.phone,
      this.dateOfBirth,
    ];

    this.isCompleted = requiredFields.every(field => field !== undefined && field !== '');
  }

  // Update preferences
  updatePreferences(preferences: Partial<IUserProfileDomain['preferences']>): void {
    this.preferences = { ...this.preferences, ...preferences };
    this.updatedAt = new Date();
  }

  // Set avatar
  setAvatar(avatarUrl: string): void {
    this.avatar = avatarUrl;
    this.updatedAt = new Date();
  }

  // Remove avatar
  removeAvatar(): void {
    this.avatar = undefined;
    this.updatedAt = new Date();
  }
}

export { IUserProfileDomain, UserProfileDomain };
