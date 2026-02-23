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

