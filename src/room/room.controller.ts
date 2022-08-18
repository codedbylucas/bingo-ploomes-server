import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';

@ApiTags('room')
@Controller('/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: 'Create a room' })
  @Post()
  createRoomAndUserHost(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomService.createRoom(createRoomDto);
  }

  // @Get('/:roomId')
  // @ApiOperation({
  //   summary: 'Get a room by its ID',
  // })
  // findSingleRoom(@Param('roomId') id: string): Promise<Room> {
  //   return this.roomService.findSingleRoom(id);
  // }

  // @Get()
  // @ApiOperation({
  //   summary: 'Get all running rooms',
  // })
  // findAllRooms(): Promise<Room[]> {
  //   return this.roomService.findAllRooms();
  // }
}
