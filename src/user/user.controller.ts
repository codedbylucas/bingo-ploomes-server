import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JoinUserRoom } from './dto/join-user-room.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'User joins the room and new cards are created for him',
  })
  @Post('/join')
  joinUserWithTheRoomAndCreateTheirCards(@Body() joinUserRoom: JoinUserRoom) {
    return this.userService.joinUserWithTheRoomAndCreateTheirCards(
      joinUserRoom,
    );
  }
}
