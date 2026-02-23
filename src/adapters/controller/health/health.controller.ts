import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from 'http-status-codes';
import { injectable } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: 'connected' | 'disconnected';
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

@controller('/health')
@injectable()
export class HealthController {
  private readonly startTime = Date.now();

  /**
   * Basic health check endpoint
   */
  @httpGet('/')
  public async getHealth(req: Request, res: Response): Promise<void> {
    const health = await this.performHealthCheck();
    
    const statusCode = health.status === 'healthy' 
      ? HTTP_STATUS_CODES.OK 
      : HTTP_STATUS_CODES.SERVICE_UNAVAILABLE;

    res.status(statusCode).json({
      success: health.status === 'healthy',
      data: health,
    });
  }

  /**
   * Detailed health check endpoint
   */
  @httpGet('/detailed')
  public async getDetailedHealth(req: Request, res: Response): Promise<void> {
    const health = await this.performHealthCheck();
    
    const statusCode = health.status === 'healthy' 
      ? HTTP_STATUS_CODES.OK 
      : HTTP_STATUS_CODES.SERVICE_UNAVAILABLE;

    res.status(statusCode).json({
      success: health.status === 'healthy',
      data: {
        ...health,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
      },
    });
  }

  /**
   * Readiness probe endpoint
   */
  @httpGet('/ready')
  public async getReadiness(req: Request, res: Response): Promise<void> {
    const isReady = await this.checkReadiness();
    
    const statusCode = isReady 
      ? HTTP_STATUS_CODES.OK 
      : HTTP_STATUS_CODES.SERVICE_UNAVAILABLE;

    res.status(statusCode).json({
      success: isReady,
      message: isReady ? 'Service is ready' : 'Service is not ready',
    });
  }

  /**
   * Liveness probe endpoint
   */
  @httpGet('/live')
  public async getLiveness(req: Request, res: Response): Promise<void> {
    const isLive = this.checkLiveness();
    
    const statusCode = isLive 
      ? HTTP_STATUS_CODES.OK 
      : HTTP_STATUS_CODES.SERVICE_UNAVAILABLE;

    res.status(statusCode).json({
      success: isLive,
      message: isLive ? 'Service is alive' : 'Service is not alive',
    });
  }

  /**
   * Perform comprehensive health check
   */
  private async performHealthCheck(): Promise<HealthCheckResponse> {
    const [dbStatus, memoryInfo] = await Promise.all([
      this.checkDatabaseConnection(),
      this.getMemoryInfo(),
    ]);

    const isHealthy = dbStatus === 'connected' && memoryInfo.percentage < 90;

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: dbStatus,
        memory: memoryInfo,
      },
    };
  }

  /**
   * Check database connection health
   */
  private async checkDatabaseConnection(): Promise<'connected' | 'disconnected'> {
    try {
      // This would be implemented with actual database connection check
      // For now, we'll simulate a basic check
      return 'connected';
    } catch {
      return 'disconnected';
    }
  }

  /**
   * Get memory usage information
   */
  private getMemoryInfo(): HealthCheckResponse['services']['memory'] {
    const memUsage = process.memoryUsage();
    const totalMemory = require('os').totalmem();
    const used = memUsage.heapUsed;
    const percentage = (used / totalMemory) * 100;

    return {
      used: Math.round(used / 1024 / 1024), // MB
      total: Math.round(totalMemory / 1024 / 1024), // MB
      percentage: Math.round(percentage * 100) / 100,
    };
  }

  /**
   * Check if service is ready to accept traffic
   */
  private async checkReadiness(): Promise<boolean> {
    const dbStatus = await this.checkDatabaseConnection();
    return dbStatus === 'connected';
  }

  /**
   * Check if service is alive (basic liveness)
   */
  private checkLiveness(): boolean {
    // Basic liveness check - service is responding
    return true;
  }
}
