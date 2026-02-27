import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { UserRoleEntity } from './userRole.repository.entity';
import { UserRoleDomain } from '../../../domains/userRole.domain';
import { 
  IUserRoleRepository, 
  USER_ROLE_REPOSITORY_TYPE 
} from './userRole.repository.interface';
import { 
  ILogger,
  LOGGER_TYPE 
} from '../../../infrastructure/logging/logger.interface';
import { inject } from 'inversify';

@injectable()
class UserRoleRepository implements IUserRoleRepository {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    // Note: This would be injected via TypeORM in a real implementation
    private readonly _repository: Repository<UserRoleEntity>
  ) {}

  public async createRole(role: UserRoleDomain): Promise<void> {
    try {
      const entity = new UserRoleEntity();
      entity.id = role.id;
      entity.name = role.name;
      entity.description = role.description;
      entity.permissions = role.permissions;
      entity.isActive = role.isActive;
      entity.createdAt = role.createdAt;
      entity.updatedAt = role.updatedAt;

      await this._repository.save(entity);
      
      this._logger.info(`User role created: ${role.name}`, {
        roleId: role.id,
        roleName: role.name,
      });
    } catch (error) {
      this._logger.error('Failed to create user role', { error });
      throw error;
    }
  }

  public async findById(id: string): Promise<UserRoleDomain | null> {
    try {
      const entity = await this._repository.findOne({ where: { id } });
      
      if (!entity) {
        return null;
      }

      return this.mapEntityToDomain(entity);
    } catch (error) {
      this._logger.error('Failed to find user role by ID', { error, id });
      throw error;
    }
  }

  public async findByName(name: string): Promise<UserRoleDomain | null> {
    try {
      const entity = await this._repository.findOne({ where: { name } });
      
      if (!entity) {
        return null;
      }

      return this.mapEntityToDomain(entity);
    } catch (error) {
      this._logger.error('Failed to find user role by name', { error, name });
      throw error;
    }
  }

  public async findAll(): Promise<UserRoleDomain[]> {
    try {
      const entities = await this._repository.find({ 
        where: { isActive: true },
        order: { name: 'ASC' }
      });
      
      return entities.map(entity => this.mapEntityToDomain(entity));
    } catch (error) {
      this._logger.error('Failed to find all user roles', { error });
      throw error;
    }
  }

  public async updateRole(role: UserRoleDomain): Promise<void> {
    try {
      await this._repository.update({ id: role.id }, {
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isActive: role.isActive,
        updatedAt: role.updatedAt,
      });
      
      this._logger.info(`User role updated: ${role.name}`, {
        roleId: role.id,
        roleName: role.name,
      });
    } catch (error) {
      this._logger.error('Failed to update user role', { error, roleId: role.id });
      throw error;
    }
  }

  public async deleteRole(id: string): Promise<void> {
    try {
      await this._repository.delete({ id });
      
      this._logger.info(`User role deleted: ${id}`, {
        roleId: id,
      });
    } catch (error) {
      this._logger.error('Failed to delete user role', { error, roleId: id });
      throw error;
    }
  }

  private mapEntityToDomain(entity: UserRoleEntity): UserRoleDomain {
    const role = new UserRoleDomain(
      entity.name,
      entity.description,
      entity.permissions
    );
    
    role.id = entity.id;
    role.isActive = entity.isActive;
    role.createdAt = entity.createdAt;
    role.updatedAt = entity.updatedAt;
    
    return role;
  }
}

export { UserRoleRepository };
