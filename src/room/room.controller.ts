import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/auth/authenticated-user.decorator';
import { UserAndRoomAuth } from 'src/auth/types/user-id-auth.type';
import { RoomService } from './room.service';

@ApiTags('room')
@Controller('/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('/single')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Fetches the room where the user was bound by the token`,
  })
  findSingleRoom(@AuthenticatedUser() userAndRoom: UserAndRoomAuth) {
    return this.roomService.findSingleRoom(userAndRoom);
  }

  @Get('/all')
  @ApiOperation({
    summary: `Search all rooms`,
  })
  findAllRooms() {
    return this.roomService.findAllRooms();
  }
}
