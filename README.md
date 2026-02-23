# Node.js TypeScript Clean Architecture

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![npm version](https://badge.fury.io/js/express.svg)](https://badge.fury.io/js/express)
[![CI/CD Pipeline](https://github.com/your-org/nodejs-ts-clean/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/nodejs-ts-clean/actions/workflows/ci.yml)

A robust Node.js application following Clean Architecture principles with TypeScript, featuring authentication, rate limiting, comprehensive logging, and modern development practices.

## 🏗️ Architecture

This project implements **3-layer hexagonal architecture** (route - controller - service) following Clean Architecture principles:

```
src/
├── adapters/           # Interface adapters (controllers, repositories, providers)
├── domains/           # Business entities and rules
├── infrastructure/    # External concerns (database, logging, middleware)
└── usecases/         # Application business logic
```

![Clean Architecture](./nodejs-ts-clean-architecture.png)

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting with configurable windows
- Security event logging

### 🏥 Health Monitoring
- Comprehensive health check endpoints
- Database connection monitoring
- Memory usage tracking
- Kubernetes-ready readiness/liveness probes

### 📝 Logging & Monitoring
- Structured logging with Winston
- Request/response logging
- Authentication event tracking
- Security event monitoring
- Environment-aware log formatting

### 🚀 Development Tools
- ESLint with Prettier integration
- Pre-commit hooks with Husky
- Environment variable validation
- Docker containerization with health checks
- Comprehensive CI/CD pipeline

### 🧪 Testing
- Unit testing with Jest
- Code coverage reporting
- Integration test support
- Security vulnerability scanning

## 📋 Prerequisites

- Node.js 18.x or 20.x
- npm 9.x or higher
- PostgreSQL (for database functionality)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/nodejs-ts-clean.git
cd nodejs-ts-clean

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=nodejs_clean
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password

# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Documentation

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

#### Get Profile
```http
POST /auth/profile
Authorization: Bearer <access_token>
```

### User Management

#### Create User
```http
POST /api/v1/user
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Health Check Endpoints

#### Basic Health Check
```http
GET /health
```

#### Detailed Health Check
```http
GET /health/detailed
```

#### Readiness Probe
```http
GET /health/ready
```

#### Liveness Probe
```http
GET /health/live
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server with nodemon
npm run compile          # Compile TypeScript to JavaScript
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run coverage         # Generate coverage report

# Code Quality
npm run lint             # Run ESLint
npm run fix              # Auto-fix linting issues
npm run prettier:check   # Check code formatting
npm run prettier:write   # Format code with Prettier

# Database
npm run typeorm          # Run TypeORM CLI commands

# Production
npm run build            # Build for production
npm start                # Start production server
```

### Code Style

This project follows:
- **Google TypeScript Style** with `gts`
- **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Pre-commit hooks** for code quality

### Docker

```bash
# Build image
docker build -t nodejs-ts-clean .

# Run container
docker run -p 3000:3000 --env-file .env nodejs-ts-clean

# With docker-compose
docker-compose up -d
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- authenticateUser.test.ts
```

### Test Structure

```
src/
├── usecases/
│   └── user/
│       ├── addUser/
│       │   ├── addUser.test.ts
│       │   └── ...
│       └── authenticateUser/
│           ├── authenticateUser.test.ts
│           └── ...
```

## 🔄 CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline:

### Pipeline Stages

1. **Test Matrix**: Node.js 18.x and 20.x
2. **Code Quality**: Linting, formatting, type checking
3. **Security**: Vulnerability audit, CodeQL analysis
4. **Build**: Application compilation
5. **Docker**: Image build and security scanning
6. **Deploy**: Staging and production deployment

### GitHub Actions

The pipeline is triggered on:
- Push to `main` and `develop` branches
- Pull requests to `main` branch

## 📊 Monitoring

### Health Checks

The application provides multiple health check endpoints:

- **Basic Health**: Service status and uptime
- **Detailed Health**: System information and resource usage
- **Readiness**: Database connectivity check
- **Liveness**: Basic service availability

### Logging

Structured logging includes:
- Request/response details
- Authentication events
- Security incidents
- Database operations
- Error tracking

## 🔧 Configuration

### Environment Validation

The application validates all required environment variables on startup:

```typescript
import { EnvValidation } from './infrastructure/config/env.validation';

// Get validated configuration
const config = EnvValidation.validate();

// Type-safe access
const jwtSecret = EnvValidation.get('JWT_SECRET');
const dbConfig = EnvValidation.getDatabaseConfig();
```

### Rate Limiting

Configure rate limiting per endpoint:

```typescript
// API rate limiter (100 requests per 15 minutes)
RateLimitMiddleware.createApiLimiter(100, 15 * 60 * 1000)

// Auth rate limiter (5 requests per 15 minutes)
RateLimitMiddleware.createAuthLimiter(5, 15 * 60 * 1000)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (following [Conventional Commits](https://www.conventionalcommits.org/))
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Code refactoring
test: Add tests
chore: Maintenance tasks
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Sebastián Ituarte** - [@sebajax](https://github.com/sebajax)

## 🙏 Acknowledgments

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Robert C. Martin
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) by Alistair Cockburn
- [Google TypeScript Style](https://github.com/google/gts)
- [Inversify](https://github.com/inversify/InversifyJS) for dependency injection

---

**Built with ❤️ using TypeScript and Clean Architecture principles**

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
// domain import
import IResponseDomain from '../../../domain/response.domain';
// controller main class import
import Controller from '../../controller';
// interface import
import {IAddMessageService} from '../../../service/message/addMessage/addMessage.service.interface';
import {IMessageData} from './addMessage.controller.interface';

class AddMessageController extends Controller {
  private addMessageService: IAddMessageService;

  public constructor(
    addMessageSchema: ObjectSchema,
    addMessageService: IAddMessageService
  ) {
    super(addMessageSchema);
    this.addMessageService = addMessageService;
  }

  public async addMessage(req: Request, res: Response): Promise<Response> {
    // get controller name for logging
    const controller = AddMessageController.name;
    const method = 'post';
    // casting body to interface type
    const body = req.body as IMessageData;
    // log end point execution
    this.logger.info(
      this.logMessage.init(req.url, method, req.method, controller, body)
    );

    try {
      // validate request with schema
      const errorRequest = this.schemaValidation(body, controller, method);
      if (errorRequest !== null) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({error: true, message: errorRequest});
      }

      // call service
      const {error, message, code, data}: IResponseDomain =
        await this.addMessageService.addMessage(body);

      return res.status(code).send({error, message, data});
    } catch (error) {
      this.logMessage.error(
        req.method,
        controller,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({error: true, message: 'SERVER_ERROR'});
    }
  }
}

export default AddMessageController;
```

Observations
<br />

- We use IResponseDomain this interface comes with the structure to define how the controller receives the response from the service.
- This class needs to extend Controller class that is part of the archetype.

<br />

---

## Schema explained

Schema is the layer that has all the request validations it will be used by the controller and only the controller. In this layer we use joi that is a validation library from javascript. In the schema folder we will need to add a single for each main controller. For this example in all the user controller we will have a single user.schema.ts that will hold all the user validations.

### In this example we will create a new schema in schema/ folder

```json
user.schema.ts
```

```typescript
// module import
import Joi from 'joi';

const addUserSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email({minDomainSegments: 2}).max(100).required(),
}).required();

export {addUserSchema};
```

<br />

---

## Util explained

Util is the layer that will have logic that will be re use in multiple services in the application, it will also hold the providers if we need to call a external source.

<br />

---

## Infraestructure explained

Infraestructure is the layer that will handle the connections to the infraestructure layer for example a database. This is the most outter layer of the application and is needed to be only injected between layers, so we don't add a infraestructure dependecy to inner layers.

### In this example we will create a database connection

```typescript
// module import
import {Sequelize} from 'sequelize-typescript';
// logger import
import {logger} from '../log/logger';

/**
 * create a connection to the database
 */
const db = new Sequelize(
  `${process.env.DB_NAME}`,
  `${process.env.DB_USER}`,
  `${process.env.DB_PASSWORD}`,
  {
    logging: msg => logger.debug(msg),
    host: `${process.env.DB_HOST}`,
    dialect: 'postgres',
    dialectOptions: {
      socketPath: process.env.DB_SOCKET || null,
    },
    pool: {
      max: parseInt(`${process.env.DB_POOL_MAX}`, 10) || 5,
      min: parseInt(`${process.env.DB_POOL_MIN}`, 10) || 0,
      acquire: parseInt(`${process.env.DB_POOL_ACQUIRE}`, 10) || 30000,
      idle: parseInt(`${process.env.DB_POOL_IDLE}`, 10) || 10000,
    },
  }
);

(async () => {
  try {
    await db.authenticate();
    logger.info('connection to database has been established successfully.');
  } catch (error) {
    logger.error(`unable to connect to the database: ${error}`);
  }
})();

export default db;
```

<br />

---

## Docker usage

    Build server
        docker-compose -p nodejs-ts-clean-architecture build

    Start server
        docker-compose up -d

    Stop server
        docker-compose down

<br />

---

## Standalone usage

    npm run dev

<br />

---

## Testing

    To run unit testing
        npm run test

    To run unit testing coverage
        npm run test_cov

<br />

---

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`

`PORT`

`API_NAME`

`API_VERSION`

`LOG_LEVEL`

`DB_NAME`

`DB_USER`

`DB_PASSWORD`

`DB_PORT`

`DB_HOST`

`MIGRATION_DIR`
