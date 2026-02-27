// Module import
import { inject, injectable } from 'inversify';
// Domain import
import { ResponseErrorDomain, ErrorNames } from '../../../domains/error.domain';
import { ResponseDomain } from '../../../domains/response.domain';
import { UserRoleDomain } from '../../../domains/userRole.domain';
// Infrastructure import
import {
  ILogger,
  LOGGER_TYPE,
} from '../../../infrastructure/logging/logger.interface';
// Repository import
import {
  IUserRoleRepository,
  USER_ROLE_REPOSITORY_TYPE,
} from '../../../adapters/repositories/userRole/userRole.repository.interface';

// Service interface
export interface IRoleManagementService {
  createRole(name: string, description: string, permissions: string[]): Promise<UserRoleDomain>;
  updateRole(id: string, name?: string, description?: string, permissions?: string[]): Promise<UserRoleDomain>;
  deleteRole(id: string): Promise<void>;
  getRole(id: string): Promise<UserRoleDomain | null>;
  getAllRoles(): Promise<UserRoleDomain[]>;
  assignPermissionToRole(roleId: string, permission: string): Promise<UserRoleDomain>;
  removePermissionFromRole(roleId: string, permission: string): Promise<UserRoleDomain>;
}

// Dependency injection type
export const ROLE_MANAGEMENT_SERVICE_TYPE = {
  RoleManagementService: Symbol.for('RoleManagementService'),
};

@injectable()
class RoleManagementService implements IRoleManagementService {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(USER_ROLE_REPOSITORY_TYPE.UserRoleRepository)
    private readonly _roleRepository: IUserRoleRepository
  ) {}

  public async createRole(name: string, description: string, permissions: string[]): Promise<UserRoleDomain> {
    // Check if role already exists
    const existingRole = await this._roleRepository.findByName(name);
    if (existingRole) {
      throw new ResponseErrorDomain({
        name: ErrorNames.ConflictError,
        error: true,
        message: 'Role already exists',
        code: 409,
      });
    }

    const role = new UserRoleDomain(name, description, permissions);
    await this._roleRepository.createRole(role);

    this._logger.info(`Role created: ${name}`, {
      roleName: name,
      permissions: permissions.length,
    });

    return role;
  }

  public async updateRole(id: string, name?: string, description?: string, permissions?: string[]): Promise<UserRoleDomain> {
    const role = await this._roleRepository.findById(id);
    if (!role) {
      throw new ResponseErrorDomain({
        name: ErrorNames.NotFoundError,
        error: true,
        message: 'Role not found',
        code: 404,
      });
    }

    if (name && name !== role.name) {
      // Check if new name already exists
      const existingRole = await this._roleRepository.findByName(name);
      if (existingRole) {
        throw new ResponseErrorDomain({
          name: ErrorNames.ConflictError,
          error: true,
          message: 'Role name already exists',
          code: 409,
        });
      }
      role.name = name;
    }

    if (description !== undefined) {
      role.description = description;
    }

    if (permissions !== undefined) {
      role.permissions = permissions;
    }

    await this._roleRepository.updateRole(role);

    this._logger.info(`Role updated: ${role.name}`, {
      roleId: id,
      roleName: role.name,
    });

    return role;
  }

  public async deleteRole(id: string): Promise<void> {
    const role = await this._roleRepository.findById(id);
    if (!role) {
      throw new ResponseErrorDomain({
        name: ErrorNames.NotFoundError,
        error: true,
        message: 'Role not found',
        code: 404,
      });
    }

    await this._roleRepository.deleteRole(id);

    this._logger.info(`Role deleted: ${role.name}`, {
      roleId: id,
      roleName: role.name,
    });
  }

  public async getRole(id: string): Promise<UserRoleDomain | null> {
    return await this._roleRepository.findById(id);
  }

  public async getAllRoles(): Promise<UserRoleDomain[]> {
    return await this._roleRepository.findAll();
  }

  public async assignPermissionToRole(roleId: string, permission: string): Promise<UserRoleDomain> {
    const role = await this._roleRepository.findById(roleId);
    if (!role) {
      throw new ResponseErrorDomain({
        name: ErrorNames.NotFoundError,
        error: true,
        message: 'Role not found',
        code: 404,
      });
    }

    role.addPermission(permission);
    await this._roleRepository.updateRole(role);

    this._logger.info(`Permission assigned to role: ${role.name}`, {
      roleId: roleId,
      roleName: role.name,
      permission: permission,
    });

    return role;
  }

  public async removePermissionFromRole(roleId: string, permission: string): Promise<UserRoleDomain> {
    const role = await this._roleRepository.findById(roleId);
    if (!role) {
      throw new ResponseErrorDomain({
        name: ErrorNames.NotFoundError,
        error: true,
        message: 'Role not found',
        code: 404,
      });
    }

    role.removePermission(permission);
    await this._roleRepository.updateRole(role);

    this._logger.info(`Permission removed from role: ${role.name}`, {
      roleId: roleId,
      roleName: role.name,
      permission: permission,
    });

    return role;
  }
}

export { RoleManagementService };
