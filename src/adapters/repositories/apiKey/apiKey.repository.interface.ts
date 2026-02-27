import { ApiKeyDomain } from '../../../domains/apiKey.domain';

// API key repository interface
export interface IApiKeyRepository {
  createApiKey(apiKey: ApiKeyDomain): Promise<void>;
  findByKeyHash(keyHash: string): Promise<ApiKeyDomain | null>;
  findByUserId(userId: string): Promise<ApiKeyDomain[]>;
  findById(id: string): Promise<ApiKeyDomain | null>;
  updateApiKey(apiKey: ApiKeyDomain): Promise<void>;
  deleteApiKey(id: string): Promise<void>;
  deactivateExpiredKeys(): Promise<void>;
}

// Dependency injection type
export const API_KEY_REPOSITORY_TYPE = {
  ApiKeyRepository: Symbol.for('ApiKeyRepository'),
};
