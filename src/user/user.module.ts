import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserServiceProxy } from './user.service.proxy';
import { OrmApiModule } from 'src/shared/modules/typeorm/api/modules';

@Module({
  imports: [OrmApiModule.forFeature([User])],
  providers: [
    UserRepository,
    UserService,
    ...UserServiceProxy.createProxy(UserService),
  ],
  exports: [UserServiceProxy],
})
export class UserModule {}
