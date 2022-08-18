import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomService } from './room.service';

@ApiTags('room')
@Controller('/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('/single')
  @ApiOperation({
    summary: `Shows application status`,
  })
  findSingleRoom() {
    return this.roomService.findSingleRoom('7b4aed21-558f-40b8-bdf7-894c5d26738c');
  }

  @Get('/all')
  @ApiOperation({
    summary: `Shows application status`,
  })
  findAllRooms() {
    return this.roomService.findAllRooms();
  }
}
