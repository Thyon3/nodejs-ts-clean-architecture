import 'reflect-metadata';
// Response import
import { CREATED } from './addUser.response';
// Domain import
import { Container } from 'inversify';
import { type CreateUserDto } from '../../../adapters/repositories/user/dto/createUser.dto';
import {
  IUserRepository,
  USER_REPOSITORY_TYPE,
} from '../../../adapters/repositories/user/user.repository.interface';
import { UserDomain } from '../../../domains/user.domain';
import { Logger } from '../../../infrastructure/logging/logger';
import {
  ILogger,
  LOGGER_TYPE,
} from '../../../infrastructure/logging/logger.interface';
import { AddUser } from './addUser';
import { ADD_USER_TYPE, IAddUser } from './addUser.interface';
// Infrastructure import

