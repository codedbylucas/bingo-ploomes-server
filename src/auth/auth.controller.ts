import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/user-auth.dto';
import { AuthUserResponse } from './types/user-auth-response.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send room and user id to generate a token with this information',
  })
  authUser(@Body() userAuthDto: UserAuthDto): Promise<AuthUserResponse> {
    return this.authService.authUser(userAuthDto);
  }
}
