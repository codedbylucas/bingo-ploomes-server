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
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Get(':roomId')
  @ApiOperation({
    summary: 'Get all running rooms',
  })
  findAll(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }
}
