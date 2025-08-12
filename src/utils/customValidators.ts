/** biome-ignore-all lint/complexity/noBannedTypes: class validator expects Object type */
import {
  registerDecorator,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ async: false })
export class IsPostgresUrlConstraint implements ValidatorConstraintInterface {
  validate(url: string) {
    // Basic regex to check postgres URL format:
    const postgresUrlRegex = /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/
    return typeof url === 'string' && postgresUrlRegex.test(url)
  }

  defaultMessage() {
    return 'URL must be a valid PostgreSQL connection string'
  }
}

export function IsPostgresUrl(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPostgresUrlConstraint,
    })
  }
}
