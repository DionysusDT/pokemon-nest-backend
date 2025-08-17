import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FavoriteService } from './favorite.service';
import { AllowRoles } from 'src/auth/decorators/allow.decorator';
import { AuthRole } from 'src/auth/enums/role.enum';
import { readItem } from 'src/shared/modules/instances/context.instance';

@ApiTags('favorites')
@ApiBearerAuth('bearer')
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly service: FavoriteService) {}

  @Get(':pokemonId/is-favorite')
  async isFavorite(@Param('pokemonId', ParseIntPipe) pokemonId: number) {
    const user = readItem('user');
    const favorite = await this.service.isFavorite(user.id, pokemonId);
    return { success: true, data: { favorite } };
  }
  
  @Post(':pokemonId')
  @AllowRoles([AuthRole.ADMIN])
  async setFavorite(@Param('pokemonId', ParseIntPipe) pokemonId: number) {
    const user = readItem('user');
    await this.service.setFavorite(user.id, pokemonId);
    return { success: true, data: { favorite: true } };
  }

  @Delete(':pokemonId')
  @AllowRoles([AuthRole.ADMIN])
  async unsetFavorite(@Param('pokemonId', ParseIntPipe) pokemonId: number) {
    const user = readItem('user');
    await this.service.unsetFavorite(user.id, pokemonId);
    return { success: true, data: { favorite: false } };
  }
}
