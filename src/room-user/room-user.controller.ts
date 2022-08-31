import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoomAndUserDto } from 'src/room-user/dto/create-room-and-user.dto';
import { RoomUserService } from './room-user.service';

@ApiTags('room')
@Controller('/room')
export class RoomUserController {
  constructor(private readonly roomUserService: RoomUserService) {}

  @ApiOperation({ summary: 'Create a room' })
  @Post()
  createRoomAndUserHost(@Body() createRoomAndUserDto: CreateRoomAndUserDto) {
    return this.roomUserService.createRoomAndUserAndRelateThem(
      createRoomAndUserDto,
    );
  }
}
