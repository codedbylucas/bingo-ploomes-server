import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @Length(1, 50)
  @ApiProperty({
    description: 'The name of the Room',
    example: 'Grupo 5',
  })
  name: string;

  @IsString()
  @Length(1, 50)
  @ApiProperty({
    description: 'Room creator nickname',
    example: 'Zézinho',
  })
  nickname: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Time in seconds to show each new ball',
    example: 10,
  })
  ballTime: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Number of cards that each user can have',
    example: 3,
  })
  userCards: number;
}
