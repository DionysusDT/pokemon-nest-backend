import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrmApiModule } from './shared/modules/typeorm/api/modules';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { startContext } from './shared/modules/instances/context.instance';
import { LoginModule } from './login/login.module';
import { AuthModule } from './auth/auth.modules';
import { PokemonModule } from './pokemon/pokemon.module';
import { SettingModule } from './setting/setting.module';
import { FavoriteModule } from './favorite/favorite.modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrmApiModule,
    UserModule,
    LoginModule,
    AuthModule,
    PokemonModule,
    SettingModule,
    FavoriteModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => startContext(() => next()))
      .forRoutes('*');
  }
}
