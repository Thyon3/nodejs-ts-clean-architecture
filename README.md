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
