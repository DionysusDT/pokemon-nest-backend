import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthRole } from './enums/role.enum';
import { LoginCreateDto } from './dto/login.create.dto';
import { AuthServiceProxy } from './auth.service.proxy';
import { AllowPublic, AllowRoles } from './decorators/allow.decorator';
import { readItem } from 'src/shared/modules/instances/context.instance';
import { SignupCreateDto } from './dto/signup.create.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dto/user.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authProxy: AuthServiceProxy) {}

  @Post('signup')
  @AllowPublic(true)
  signup(@Body() dto: SignupCreateDto) {
    return this.authProxy.service.signup(
      dto.email,
      dto.full_name,
      dto.password,
    );
  }

  @Post('login')
  @AllowPublic(true)
  async login(@Body() dto: LoginCreateDto) {
    const r = await this.authProxy.service.createLogin(dto);
    return {
      success: true,
      data: {
        access_token: r.access_token,
        access_token_expiry: r.access_token_expiry,
        user_id: r.id,
        login_id: r.login_id,
        email: r.email,
        full_name: r.full_name,
      },
    };
  }

  @ApiBearerAuth('bearer')
  @Post('logout')
  @AllowRoles([AuthRole.ADMIN])
  async logout() {
    const login = readItem('login') as { id: number };
    await this.authProxy.service.logout(login.id);
    return { ok: true };
  }

  @ApiBearerAuth('bearer')
  @Get('profile')
  @AllowRoles([AuthRole.ADMIN])
  profile() {
    const user = readItem('user');
    const userResponse: UserResponseDto = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    return { success: true, data: userResponse };
  }
}
