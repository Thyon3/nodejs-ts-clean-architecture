import { ApplicationMetricsDomain } from '../../../domains/applicationMetrics.domain';

// Application metrics repository interface
export interface IApplicationMetricsRepository {
  createMetric(metric: ApplicationMetricsDomain): Promise<void>;
  getMetricsByType(metricType: string, hours: number): Promise<ApplicationMetricsDomain[]>;
  getRecentMetrics(hours: number): Promise<ApplicationMetricsDomain[]>;
  getCriticalMetrics(): Promise<ApplicationMetricsDomain[]>;
  deleteOldMetrics(daysToKeep: number): Promise<void>;
  getMetricsSummary(hours: number): Promise<Record<string, { avg: number; max: number; min: number; count: number }>>;
}

// Dependency injection type
export const APPLICATION_METRICS_REPOSITORY_TYPE = {
  ApplicationMetricsRepository: Symbol.for('ApplicationMetricsRepository'),
};
