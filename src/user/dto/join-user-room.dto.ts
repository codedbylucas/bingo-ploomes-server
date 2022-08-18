import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class JoinUserRoom {
  @IsString()
  @ApiProperty({
    description: 'The name of the User',
    example: 'Pipoca doce',
  })
  nickname: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID of the room in which the user will connect',
    example: 'fa20725e-521f-4964-945d-a6f60f34387f',
  })
  roomId: string;
}
