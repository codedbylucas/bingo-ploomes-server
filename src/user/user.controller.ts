import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create an user' })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'List all existing users' })
  @Get()
  findAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get('/:userId')
  @ApiOperation({
    summary: 'Get a user by its ID',
  })
  findSingleUser(@Param('userId') id: string): Promise<User> {
    return this.userService.findSingleUser(id);
  }
}
