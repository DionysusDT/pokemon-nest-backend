import { Module } from '@nestjs/common';
import { OrmApiModule } from 'src/shared/modules/typeorm/api/modules';
import { Setting } from './setting.entity';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { SettingServiceProxy } from './setting.service.proxy';
import { SettingRepository } from './setting.repository';

@Module({
  imports: [
    OrmApiModule.forFeature([Setting]),
  ],
  providers: [
    SettingRepository,
    SettingService,
    ...SettingServiceProxy.createProxy(SettingService),
  ],
  controllers: [SettingController],
  exports: [SettingServiceProxy],
})
export class SettingModule {}
