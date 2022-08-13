import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

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
  @IsPositive()
  // @Min(5)
  // @Max(10)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Time in seconds to show each new ball (5 to 10 seconds)',
    example: 10,
  })
  ballTime: number;

  @IsNumber()
  @IsPositive()
  // @Min(1)
  // @Max(3)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Number of cards that each user can have (1 to 3)',
    example: 3,
  })
  userCards: number;
}
