import { UserRoleDomain } from '../../../domains/userRole.domain';

// User role repository interface
export interface IUserRoleRepository {
  createRole(role: UserRoleDomain): Promise<void>;
  findById(id: string): Promise<UserRoleDomain | null>;
  findByName(name: string): Promise<UserRoleDomain | null>;
  findAll(): Promise<UserRoleDomain[]>;
  updateRole(role: UserRoleDomain): Promise<void>;
  deleteRole(id: string): Promise<void>;
}

// Dependency injection type
export const USER_ROLE_REPOSITORY_TYPE = {
  UserRoleRepository: Symbol.for('UserRoleRepository'),
};
