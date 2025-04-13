import { Prisma } from '@prisma/client';

interface ErrorShape {
  message: string;
  code?: string;
  statusCode?: number;
}

export type CallShape = {
  err?: ErrorShape;
  success?: boolean;
  data?: Record<string, any>;
}

export function nope(error: unknown): CallShape {
  return { err: parseError(error) };
}

export function ok(data: unknown): CallShape {
  return { success: true, data: data as Record<string, any> };
}

export function parseError(error: unknown): ErrorShape {
  // console.error('parseError', typeof error, error?.constructor?.name);

  let err = null;
  if (error instanceof Prisma.PrismaClientValidationError) {
    const errorMessage = error.message;

    // Check for specific validation error patterns
    if (errorMessage.includes('Null constraint violation')) {
      const match = errorMessage.match(
        /Null constraint violation on the fields: \(`(.+?)`\)/
      );
      const fieldName = match?.[1] || 'field';
      err = {
        code: 'NULL_CONSTRAINT',
        message: `Field "${fieldName}" cannot be null or empty`,
      };
    } else if (errorMessage.includes('Argument')) {
      const match = errorMessage.match(/Argument `(\w+)` is missing/);
      const fieldName = match?.[1] || 'field';
      err = {
        code: 'MISSING_FIELD',
        message: `Field "${fieldName}" is missing`,
      };
    } else if (errorMessage.includes('Invalid value for argument')) {
      const match = errorMessage.match(/Invalid value for argument `(\w+)`/);
      const fieldName = match?.[1] || 'field';
      err = {
        code: 'VALIDATION_ERROR',
        message: `Invalid value provided for ${fieldName}`,
      };
    } else if (errorMessage.includes('Invalid enum value')) {
      const match = errorMessage.match(/Invalid enum value. Expected (\w+)/);
      const enumType = match?.[1] || 'value';
      err = {
        code: 'INVALID_ENUM',
        message: `Invalid enum value. Expected one of the allowed ${enumType} values`,
      };
    } else {
      err = {
        code: 'VALIDATION_ERROR',
        message: 'Invalid data provided',
      };
    }
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const fields = (error.meta?.target as string[]) || [];
    // Handle specific Prisma errors
    switch (error.code) {
      case 'P2000':
        err = {
          code: 'P2000',
          message: 'The provided value is too long for the column.',
        };
        break;
      case 'P2001':
        err = {
          code: 'P2001',
          message: 'The record to delete does not exist.',
        };
        break;
      case 'P2002':
        err = {
          code: 'P2002',
          message: `Unique constraint violation: ${fields.join(', ')}`,
        };
        break;
      case 'P2003':
        err = {
          code: 'P2003',
          message: `Foreign key constraint violation: ${fields.join(', ')}`,
        };
        break;
      default:
        // For other known or unknown Prisma error codes
        err = {
          code: error.code,
          message: `Database error: ${error.message}`,
        };
        break;
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    err = {
      code: 'UNKNOWN_ERROR',
      message: `Database error: ${error.message}`,
    };
  } else if (error instanceof Error) {
    // If it's a network or other error from the client side
    err = { message: error.message || 'An unexpected error occurred.' };
  } else if (error && typeof error === 'string') {
    err = { message: error };
  } else if (error && typeof error === 'object' && 'message' in error) {
    // Handle structured error response (e.g., server error)
    const errObj = error as ErrorShape;
    err = {
      message: errObj.message || 'An unknown error occurred.',
      code: errObj.code,
      statusCode: errObj.statusCode,
    };
  } else {
    // Catch-all for unexpected error formats
    err = {
      message: 'An unexpected error occurred while processing the error.',
    };
  }
  // console.log('err', err);

  return err;
}

export function parseErrorClient(error: unknown): ErrorShape {
  let err: ErrorShape = { message: 'An unexpected error occurred.' };
  if (error instanceof Error) {
    // If it's a network or other error from the client side
    err = {
      message: error.message || 'An unexpected error occurred.',
    };
  } else if (error && typeof error === 'object' && 'message' in error) {
    // Handle structured error response (e.g., server error)
    const errObj = error as ErrorShape;
    err = {
      message: errObj.message || 'An unknown error occurred.',
      code: errObj.code,
      statusCode: errObj.statusCode,
    };
  } else {
    // Catch-all for unexpected error formats
    err = {
      message: 'An unexpected error occurred while processing the error.',
    };
  }

  return err;
}
