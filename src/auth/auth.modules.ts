import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceProxy } from './auth.service.proxy';
import { UserModule } from '../user/user.module';
import { LoginModule } from '../login/login.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';

@Global()
@Module({
  imports: [CryptoModule, UserModule, LoginModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...AuthServiceProxy.createProxy(AuthService),
    { provide: APP_GUARD, useClass: AuthGuard },
    Reflector,
  ],
  exports: [AuthServiceProxy],
})
export class AuthModule {}
