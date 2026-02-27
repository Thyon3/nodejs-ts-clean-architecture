import { SessionDomain } from '../../../domains/session.domain';

// Session repository interface
export interface ISessionRepository {
  createSession(session: SessionDomain): Promise<void>;
  findBySessionId(sessionId: string): Promise<SessionDomain | null>;
  findByUserId(userId: string): Promise<SessionDomain[]>;
  updateSession(session: SessionDomain): Promise<void>;
  deleteBySessionId(sessionId: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deactivateExpiredSessions(): Promise<void>;
}

// Dependency injection type
export const SESSION_REPOSITORY_TYPE = {
  SessionRepository: Symbol.for('SessionRepository'),
};
