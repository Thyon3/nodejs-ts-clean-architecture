// module import
import type { AxiosResponse } from 'axios';
// domain import
import { ResponseDomain } from '../../../domains/response.domain';
import type { UserDomain } from '../../../domains/user.domain';
// interface import
import type { IAddUserProvider } from './addUser.interface';
// provider import
import { Provider } from '../provider';

export class AddUserProvider extends Provider implements IAddUserProvider {
  // method to create a new user
  public async create(user: UserDomain): Promise<ResponseDomain> {
