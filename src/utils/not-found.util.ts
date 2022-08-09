import { NotFoundException } from '@nestjs/common';

export function notFoundError(data: any, obj: string): void {
  if (!data || data.length === 0) {
    throw new NotFoundException(`Could not find ${obj}.`);
  }
}
