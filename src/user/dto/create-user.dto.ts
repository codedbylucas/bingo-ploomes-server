import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 50)
  @ApiProperty({
    description: 'The name of the User',
    example: 'Pipoca doce',
  })
  nickname: string;

  @IsUUID()
  @ApiProperty({
    description: 'Room ID where the user will be connected ',
    example: 'fa20725e-521f-4964-945d-a6f60f34387f',
  })
  roomId: string;
}
