import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { SettingService } from './setting.service';
import { AllowRoles } from 'src/auth/decorators/allow.decorator';
import { AuthRole } from 'src/auth/enums/role.enum';
import { PokemonConfigCreateDto } from './dto/setting,create.dto';
import { PokemonConfigResponseDto } from './dto/setting.response.dto';

@ApiTags('settings')
@ApiBearerAuth('bearer')
@Controller('settings')
export class SettingController {
    constructor(private readonly service: SettingService) { }

    @Get('pokemon')
    @ApiOkResponse({ type: PokemonConfigResponseDto })
    async getPokemonConfig(): Promise<PokemonConfigResponseDto> {
        const value = await this.service.getPokemonConfig();
        return { ...value };
    }

    @Post('pokemon')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: PokemonConfigCreateDto })
    @ApiOkResponse({ type: PokemonConfigResponseDto })
    async postPokemonConfig(@Body() body: PokemonConfigCreateDto): Promise<PokemonConfigResponseDto> {
        const saved = await this.service.upsertPokemonConfig(body);
        return { ...saved };
    }

    @Put('pokemon')
    @AllowRoles([AuthRole.ADMIN])
    @ApiBody({ type: PokemonConfigCreateDto })
    @ApiOkResponse({ type: PokemonConfigResponseDto })
    async putPokemonConfig(@Body() body: PokemonConfigCreateDto): Promise<PokemonConfigResponseDto> {
        const saved = await this.service.upsertPokemonConfig(body);
        return { ...saved };
    }
}
