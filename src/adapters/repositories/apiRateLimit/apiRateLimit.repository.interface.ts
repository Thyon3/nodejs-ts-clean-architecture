import { ApiRateLimitDomain } from '../../../domains/apiRateLimit.domain';

// API rate limiting repository interface
export interface IApiRateLimitRepository {
  createRateLimit(rateLimit: ApiRateLimitDomain): Promise<void>;
  findByUserIdAndEndpoint(userId: string, endpoint: string): Promise<ApiRateLimitDomain | null>;
  updateRateLimit(rateLimit: ApiRateLimitDomain): Promise<void>;
  deleteRateLimit(id: string): Promise<void>;
  deleteExpiredLimits(): Promise<void>;
}

// Dependency injection type
export const API_RATE_LIMIT_REPOSITORY_TYPE = {
  ApiRateLimitRepository: Symbol.for('ApiRateLimitRepository'),
};
