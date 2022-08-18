import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the User',
    example: 'Pipoca doce',
  })
  nickname: string;
}
