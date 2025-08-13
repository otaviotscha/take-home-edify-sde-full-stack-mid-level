# Edify SDE Full Stack Mid-Level Take-Home Project

This project is a backend GraphQL API built with Bun and TypeScript, designed as a take-home assignment for a Full Stack Software Development Engineer (Mid-Level) position. It includes features for user management, authentication, vocabulary, and learning sessions, backed by a PostgreSQL database.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management**: Create, retrieve, update, and delete user accounts.
- **Authentication**: Secure user authentication using JWT and local strategies.
- **Authorization**: Role-based access control (RBAC) for different user roles (e.g., admin, regular user).
- **Vocabulary Management**: CRUD operations for words and vocabulary lists.
- **Learning Sessions**: Functionality to manage and track learning sessions and attempts.
- **Health Check**: Endpoint to monitor the application's health.

## Technologies Used

- **Backend**: Bun, TypeScript
- **Framework**: NestJS (for GraphQL API structure)
- **GraphQL**: Mercurius Server
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Package Manager**: Bun
- **Containerization**: Docker, Docker Compose
- **Authentication**: Passport.js, JWT
- **Linting/Formatting**: Biome

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Bun](https://bun.sh/docs/installation)
- [Docker](https://www.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/otaviotscha/take-home-edify-sde-full-stack-mid-level.git
    cd take-home-edify-sde-full-stack-mid-level
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

### Environment Variables

Create a `.env.development` if you want to use environment variables for your application settings locally or `.env.development` for production (docker runs as production). Take a look at the `.env.example` file.

### Running the Application

#### Production Mode

1.  **Start the PostgreSQL database and API using Docker Compose:**
    ```bash
    bun run docker:rebuild-run
    ```

#### Development Mode

1.  **Start the PostgreSQL database using Docker Compose:**
    ```bash
    docker-compose up db
    ```

2.  **Create the database and push schema:**
    ```bash
    bun run db:push
    ```

3.  **Start the application:**
    ```bash
    bun run start:dev
    ```

The GraphQL API will be accessible at `http://localhost:3000/graphql` (or the port specified in your `.env` file).

## Database

This project uses PostgreSQL as its database, managed with Drizzle ORM.

- **Schema Definition**: The database schema is defined in `src/db/schema.ts`.
- **Migrations**: Drizzle Kit is used for applying database schemas.
  - To push schema to database: `bun run db:push` (understand the approach [here - option 2](https://orm.drizzle.team/docs/migrations))

## API Endpoints

The application exposes a GraphQL API. You can interact with it using a GraphQL client (e.g., Postman, Insomnia) at `http://localhost:3000/graphql`. The GraphQL playground will be available in development mode.

## Testing

Tests are written using Bun.

To run the tests:
```bash
bun run test
```

## License

This project is licensed under the GPLv3 License. See the `LICENSE` file for details.
