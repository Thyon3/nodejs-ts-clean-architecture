// User role domain interface
interface IUserRoleDomain {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User role domain class
class UserRoleDomain implements IUserRoleDomain {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string, description: string, permissions: string[]) {
    const crypto = require('crypto');
    this.id = crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.permissions = permissions;
    this.isActive = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Check if role has specific permission
  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  // Add permission to role
  addPermission(permission: string): void {
    if (!this.hasPermission(permission)) {
      this.permissions.push(permission);
      this.updatedAt = new Date();
    }
  }

  // Remove permission from role
  removePermission(permission: string): void {
    const index = this.permissions.indexOf(permission);
    if (index > -1) {
      this.permissions.splice(index, 1);
      this.updatedAt = new Date();
    }
  }

  // Activate role
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  // Deactivate role
  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}

export { IUserRoleDomain, UserRoleDomain };
