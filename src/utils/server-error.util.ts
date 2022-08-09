import { UnprocessableEntityException } from '@nestjs/common';

export function serverError(error: Error): undefined {
  const errorLines = error.message?.split('\n');
  const lastErrorLine = errorLines[errorLines.length - 1].trim();

  if (!lastErrorLine) {
    console.log(error);
  }

  throw new UnprocessableEntityException(
    lastErrorLine || 'Oops, something happened.',
  );
}
