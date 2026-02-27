// Module import
import { IResponseDomain } from '../../../domains/response.domain';

// Request interface for creating API key
export interface ICreateApiKeyRequest {
  userId: string;
  name: string;
  permissions: string[];
  expiresAt?: Date;
  rateLimitPerHour?: number;
}

// Response interface for creating API key
export interface ICreateApiKeyResponse {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  expiresAt?: Date;
  rateLimitPerHour: number;
}

// Service interface
export interface ICreateApiKey {
  execute(request: ICreateApiKeyRequest): Promise<IResponseDomain<ICreateApiKeyResponse>>;
}

// Dependency injection type
export const CREATE_API_KEY_TYPE = {
  CreateApiKey: Symbol.for('CreateApiKey'),
};
