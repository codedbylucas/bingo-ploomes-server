import { UnauthorizedException } from '@nestjs/common';

export function isAdmin(data: any): void {
  if (!data) {
    throw new UnauthorizedException('Access denied!');
  }
}
