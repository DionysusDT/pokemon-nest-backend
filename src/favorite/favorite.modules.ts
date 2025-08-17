import { Module } from '@nestjs/common';
import { OrmApiModule } from 'src/shared/modules/typeorm/api/modules';
import { Favorite } from './favorite.entity';
import { FavoriteRepository } from './favorite.repository';
import { FavoriteService } from './favorite.service';
import { FavoriteServiceProxy } from './favorite.service.proxy';
import { FavoriteController } from './favorite.controller';

@Module({
  imports: [OrmApiModule.forFeature([Favorite])],
  providers: [
    FavoriteRepository,
    FavoriteService,
    ...FavoriteServiceProxy.createProxy(FavoriteService),
  ],
  controllers: [FavoriteController],
  exports: [FavoriteServiceProxy],
})
export class FavoriteModule {}
