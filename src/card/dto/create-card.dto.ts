import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateCardDto {
  @IsUUID()
  @ApiProperty({
    description: 'User ID that will have the card created',
    example: 'fa20725e-521f-4964-945d-a6f60f34387f',
  })
  userId: string;
}
