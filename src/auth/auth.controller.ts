import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthUserResponse } from './types/auth-user-response.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send room and user id to generate a token with this information',
  })
  authUser(@Body() createAuthDto: CreateAuthDto): Promise<AuthUserResponse> {
    return this.authService.authUser();
  }
}
