import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoomAndUserHost(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoomAndUserHost(createRoomDto);
  }

  @Get(':roomId')
  @ApiOperation({
    summary: 'Get a room by its ID',
  })
  findSingleRoom(@Param('roomId') id: string) {
    return this.roomService.findSingleRoom(id);
  }

  @ApiTags('all-rooms')
  @Get('room')
  @ApiOperation({
    summary: 'Get all running rooms',
  })
  findAllRooms() {
    return this.roomService.findAllRooms();
  }
}
