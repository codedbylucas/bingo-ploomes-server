import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateAuthDto {
  @IsUUID()
  @ApiProperty({
    description: 'User ID that is authenticating',
    example: 'fa20725e-521f-4964-945d-a6f60f34387f',
  })
  userId: string;

  @IsUUID()
  @ApiProperty({
    description: 'Room ID where the user will be connected',
    example: 'fa20725e-521f-4964-945d-a6f60f34387f',
  })
  roomId: string;
}
