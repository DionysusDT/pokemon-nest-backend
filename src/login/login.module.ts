import { Module } from '@nestjs/common';
import { Login } from './login.entity';
import { LoginRepository } from './login.repository';
import { LoginService } from './login.service';
import { LoginServiceProxy } from './login.service.proxy';
import { OrmApiModule } from 'src/shared/modules/typeorm/api/modules';

@Module({
  imports: [OrmApiModule.forFeature([Login])],
  providers: [
    LoginRepository,
    LoginService,
    ...LoginServiceProxy.createProxy(LoginService),
  ],
  exports: [LoginServiceProxy],
})
export class LoginModule {}
