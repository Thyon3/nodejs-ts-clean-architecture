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
