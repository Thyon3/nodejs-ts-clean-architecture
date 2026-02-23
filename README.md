## Authors

- Sebastián Ituarte [@sebajax](https://github.com/sebajax)

<br />

## This structure will help in the project building using nodejs and typescript

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![npm version](https://badge.fury.io/js/express.svg)](https://badge.fury.io/js/express)

![alt text](./nodejs_logo.png)

## This app uses conventional commits

[Conventional commits url](https://www.conventionalcommits.org/en/v1.0.0/)

<br />

## This api uses 3-layer hexagonal architecture (route - controller - service)

![alt text](./nodejs-ts-clean-architecture.png)

<br />

## Example showed below in each step

![alt text](./example.png)

#### Insert a new user

```http
  POST /api/v1/user
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `name`    | `string` | **Required**. User name to be created |
| `email`   | `string` | **Required**. Email to be created     |

```json
Request
{
  "name": "Jonh Doo",
  "email": "jonh.doo@example.com"
}

Response
{
    "error": false,
    "message": "USER_CREATED",
    "data": {
        "userId": 1,
        "name": "John Doo",
        "email": "example@example.com",
        "updatedAt": "2023-05-25T22:13:07.013Z",
        "createdAt": "2023-05-25T22:13:07.013Z"
    }
}
```

<br />

## Route explained

Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, PUT, DELETE).

![alt text](./route.png)

### In this example we will create a new route in api/route folder user.route.ts

```json
user.route.ts
```

```typescript
// module import
import express, {Request, Response} from 'express';
// middleware import
import checkBodyMiddleware from '../middleware/checkBody.middleware';
// interface import
import {addUserController} from '../../controller/user/addUser/addUser.controller.interface';

const router = express.Router();

// add a new user
router.post(
  '/',
  checkBodyMiddleware,
  (req: Request, res: Response): Promise<Response> => {
    // execute controller
    return addUserController.addUser(req, res);
  }
);

export default router;
```

Observations
<br />

- We are adding a middleware to check that there is a body present in the POST execution.
- We also include addUserController to inject the dependency in the user route factory and not a direct injection so we can add a unit test mocking this model later.

<br />

---

## Service explained

Service is the layer that defines the use case definition resolution. In service main folder we add a folder with this specific service name in this example we use user so the structure will be /service/user. In this folder we have 3 files that are needed:
user.response.ts (This holds all the use case resposes positive or negative)
user.service.interface.ts (This holds the service factory for dependency injection and all it's definitions)
user.service.ts (This holds the service coding for resolution)

![alt text](./service.png)

### In this example we will create a new service in service/user folder to add new users

<br />

1. Create the needed structure in service folder create a new folder user if needed, then create a folder [addUser]
2. Create a file named addUser.reponse.ts to addUser folder
3. Create a file named addUser.service.interface.ts to addUser folder
4. Create a file named addUser.service.ts to addUser folder

#### 2. Create a file named addUser.reponse.ts to addUser folder

```json
addUser.response.ts
```

```typescript
// module import
import {StatusCodes} from 'http-status-codes';
// domain import
import IResponseDomain from '../../../domain/response.domain';
// interface import
import {IAddUserResponse} from './addUser.service.interface';

/*
 * BAD_REQUEST
 */
const USER_EXISTS: IResponseDomain = {
  error: true,
  message: 'USER_EXISTS',
  code: StatusCodes.BAD_REQUEST,
};

/*
 * INTERNAL_SERVER_ERROR
 */
const INSERT_USER_ERROR: IResponseDomain = {
  error: true,
  message: 'INSERT_USER_ERROR',
  code: StatusCodes.INTERNAL_SERVER_ERROR,
};

/*
 * CREATED
 */
const CREATED: IResponseDomain = {
  error: false,
  message: 'USER_CREATED',
  code: StatusCodes.CREATED,
};

// response to export with definition
const addUserResponse: IAddUserResponse = {
  USER_EXISTS,
  INSERT_USER_ERROR,
  CREATED,
};

export default addUserResponse;

export {USER_EXISTS, INSERT_USER_ERROR, CREATED};
```

Observations
<br />

- We use IResponseDomain this interface comes with the structure to define how the controller receives the response from the service.
- We also include IAddUserResponse this is only an interface in the service.interface file to define all the responses that the service will have positive or negative.
- We will need a basic service.interface file with the needed interface structure like in the example below.

```typescript
// for addMessageService response domain
interface IAddUserResponse {
  USER_EXISTS: IResponseDomain;
  INSERT_USER_ERROR: IResponseDomain;
  CREATED: IResponseDomain;
}
```

#### 3. Create a file named addUser.interface.service.ts to addUser folder

```json
addUser.service.interface.ts
```

```typescript
// domain import
import {IUserData} from '../../../controller/user/addUser/addUser.controller.interface';
import IResponseDomain from '../../../domain/response.domain';
// model import
import {userModel} from '../../../model/user/user.model.interface';
// service import
import AddUserService from './addUser.service';

// for addMessageService response domain
interface IAddUserResponse {
  USER_EXISTS: IResponseDomain;
  INSERT_USER_ERROR: IResponseDomain;
  CREATED: IResponseDomain;
}

// interface to implement the service
interface IAddUserService {
  addUser(userData: IUserData): Promise<IResponseDomain>;
}

/*
 * service factory init
 */
const addUserService: IAddUserService = new AddUserService(userModel);

export {IAddUserResponse, IAddUserService, addUserService};
```

Observations
<br />

- We use IResponseDomain this interface comes with the structure to define how the controller receives the response from the service.
- We also include userModel to inject the dependency in the addUserService factory and not a direct injection so we can add a unit test mocking this model later.
- We will need a basic service implementation file with the class and that implements this interface.

<br />

#### 4. Create a file named addUser.service.ts to addUser folder

```json
addUser.service.ts
```

```typescript
// domain import
import IResponseDomain from '../../../domain/response.domain';
// interface import
import {IUserModel} from '../../../model/user/user.model.interface';
import {IUserData} from '../../../controller/user/addUser/addUser.controller.interface';
import {IAddUserResponse, IAddUserService} from './addUser.service.interface';
// service main class import
import Service from '../../service';
// response import
import addUserResponse from './addUser.response';

class AddUserService extends Service implements IAddUserService {
  private response: IAddUserResponse;
  private userModel: IUserModel;

  public constructor(userModel: IUserModel) {
    super();
    this.response = addUserResponse;
    this.userModel = userModel;
  }

  public async addUser(userData: IUserData): Promise<IResponseDomain> {
    try {
      // map user data to user model data
      const user = {
        name: userData.name,
        email: userData.email,
      };

      const createdUser = await this.userModel.createUser(user);

      // if all the process was succuessfully we return an OK status
      return {
        ...this.response.CREATED,
        data: createdUser,
      };
    } catch (error) {
      this.logger.error(`${AddUserService.name} error ${error}`);
      return this.response.INSERT_USER_ERROR;
    }
  }
}

export default AddUserService;
```

Observations
<br />

- We use IResponseDomain this interface comes with the structure to define how the controller receives the response from the service.
- This class needs to extend Service class that is part of the archetype.
- It has to implement IAddUserService because it has all the interface contract of this class.

<br />

---

## Model explained

Model is the layer that defines the interactaion with a datasource from the infraestructure layer, this layer colud be a relational database or a no relational database like mongodb. For this layer the structure needs a folder for the model and 2 files:
user.model.interface.ts (This holds the model factory for dependency injection and all it's definitions)
user.model.ts (This holds the model definition depending on the datasource)

![alt text](./model.png)

### In this example we will create a new model in model/user folder

<br />

1. Create the needed structure in model folder create a new folder user.
2. Create a file named user.model.interface.ts to user folder
3. Create a file named user.model.ts to user folder

#### 2. Create a file named user.model.interface.ts to user folder

```json
user.model.interface.ts
```

```typescript
// module import
import {Optional} from 'sequelize';
// model import
import {UserModel} from '../index';

interface IUserModel {
  userId: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  createUser(data: object): Promise<object>;
}

type UserCreationAttributes = Optional<IUserModel, 'userId'>;

/*
 * model factory init
 */
const userModel: IUserModel = new UserModel();

export {IUserModel, UserCreationAttributes, userModel};
```

Observations
<br />

- We will need a basic user.model file all the models file will be called from model/index.ts and not directly because it will add the models to the database session.

```json
model/index.ts
```

```typescript
// interface import
import db from '../infraestructure/database/db';
// model import
import MessageModel from './message/message.model';
import UserModel from './user/user.model';

// map models to db session
db.addModels([UserModel, MessageModel]);

export {UserModel, MessageModel};
```

#### 3. Create a file named user.model.ts to user folder

```typescript
// module import
import {Model, Table, Column, DataType, HasMany} from 'sequelize-typescript';
// interface import
import {IUserModel, UserCreationAttributes} from './user.model.interface';
// model import
import MessageModel from '../message/message.model';

@Table({
  tableName: 'user',
  timestamps: true,
})
class UserModel
  extends Model<IUserModel, UserCreationAttributes>
  implements IUserModel
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'user_id',
  })
  userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at',
  })
  updatedAt: Date;

  @HasMany(() => MessageModel)
  messages: MessageModel[];

  // method for creating a new user into the databse
  public async createUser(user: UserCreationAttributes): Promise<object> {
    const userCreate = new UserModel(user);
    return userCreate.save();
  }
}

export default UserModel;
```

Observations
<br />

- It will implement the interface defined in user.model.interface and will extend Model from sequelize adding the generics needed to operate.

<br />

---

## Controller explained

Contoller is the layer that will be in between the route and the service it will serve has a validation layer previously to calling the service, and will have all the response definition needed fot the api. In controller main folder we add a folder with this specific controller name in this example we use user so the structure will be /controller/user. In this folder we have 2 files that are needed:
user.controller.interface.ts (This holds the controller factory for dependency injection and all it's definitions)
user.controller.ts (This holds the controller coding for resolution)

![alt text](./controller.png)

### In this example we will create a new controller in contoller/user folder to add new users

<br />

1. Create the needed structure in controller folder create a new folder user if needed, then create a folder [addUser]
2. Create a file named addUser.controller.interface.ts to addUser folder
3. Create a file named addUser.controller.ts to addUser folder

### 2. Create a file named addUser.controller.interface.ts to addUser folder

```json
addUser.controller.interface.ts
```

```typescript
// controller import
import AddUserController from '../addUser/addUser.controller';
// schema import
import {addUserSchema} from '../../../schema/user.schema';
// interface import
import {addUserService} from '../../../service/user/addUser/addUser.service.interface';

/*
 * body request data interface
 */
interface IUserData {
  name: string;
  email: string;
}

/*
 * controller factory init
 */
const addUserController: AddUserController = new AddUserController(
  addUserSchema,
  addUserService
);

export {IUserData, addUserController};
```

Observations
<br />

- We also include addUserService to inject the dependency in the addUserController factory and not a direct injection so we can add a unit test mocking this model later.
- We will need a basic controller implementation file with the class and that implements this interface.

<br />

### 3. Create a file named addUser.controller.ts to addUser folder

```json
addUser.contoller.ts
```

```typescript
// module import
import {Request, Response} from 'express';
import {ObjectSchema} from 'joi';
import {StatusCodes} from 'http-status-codes';
