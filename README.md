# take-home-edify-sde-full-stack-mid-level

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

## Environment Variables Handling

In this project, environment variables are loaded and validated using Bun's native capabilities instead of NestJS’s ConfigModule. This decision was made to keep the setup simpler and more straightforward.
Why Bun for Environment Variables?

- **Automatic env file selection**: When NODE_ENV is set to production, Bun automatically loads environment variables from .env.production instead of .env or .env.development. This prevents accidentally running the API with development settings in a production environment.
- **Synchronous loading and validation**: Bun loads and validates environment variables synchronously at startup, simplifying configuration management without asynchronous complexities seen in some NestJS modules.
- **Avoids DI complexity**: By using Bun directly, we bypass dependency injection issues related to asynchronous config loading in NestJS (e.g., with forRootAsync).

This approach results in a clean, reliable configuration setup with strong type safety and environment-specific loading behavior, making it easier to manage multiple environments securely and effectively.