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

// Test #AddUser()
describe('#AddUser()', () => {
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  let addUser: IAddUser;
  let testContainer: Container;
  // Create a user domain instance from body
  const user = new UserDomain('John Doo', 'example@example.com');

  beforeEach(() => {
    // Create a mock UserRepository
    userRepositoryMock = {
      createUser: jest.fn(),
      findUser: jest.fn(),
    } as jest.Mocked<IUserRepository>;
    // Create a new container for each test
    testContainer = new Container();
    // Bind the logger
    testContainer.bind<ILogger>(LOGGER_TYPE.Logger).to(Logger);
    // Bind the needed repository
    testContainer
      .bind<IUserRepository>(USER_REPOSITORY_TYPE.UserRepository)
      .toConstantValue(userRepositoryMock);
    // Bind the use case
    testContainer.bind<IAddUser>(ADD_USER_TYPE.AddUser).to(AddUser);
    // Get the user container with a new repository binding
    addUser = testContainer.get<IAddUser>(ADD_USER_TYPE.AddUser);
  });

  afterEach(() => {
    // Clean up container after each test
    testContainer.unbindAll();
  });

