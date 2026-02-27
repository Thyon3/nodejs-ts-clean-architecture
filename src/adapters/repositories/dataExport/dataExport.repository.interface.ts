import { DataExportDomain } from '../../../domains/dataExport.domain';

// Data export repository interface
export interface IDataExportRepository {
  createExport(exportRequest: DataExportDomain): Promise<void>;
  findById(id: string): Promise<DataExportDomain | null>;
  findByUserId(userId: string): Promise<DataExportDomain[]>;
  updateExport(exportRequest: DataExportDomain): Promise<void>;
  deleteExport(id: string): Promise<void>;
  deleteExpiredExports(): Promise<void>;
  getExportsByStatus(status: string): Promise<DataExportDomain[]>;
}

// Dependency injection type
export const DATA_EXPORT_REPOSITORY_TYPE = {
  DataExportRepository: Symbol.for('DataExportRepository'),
};
