import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { PokemonQueryDto } from './dto/pokemon.query.dto';
import { AllowRoles } from 'src/auth/decorators/allow.decorator';
import { AuthRole } from 'src/auth/enums/role.enum';
import type { File as MulterFile } from 'multer';

@ApiTags('pokemon')
@ApiBearerAuth('bearer')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly service: PokemonService) { }

  @Post('import-csv')
  @AllowRoles([AuthRole.ADMIN])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const ok =
          file.mimetype === 'text/csv' ||
          file.originalname.toLowerCase().endsWith('.csv');
        cb(ok ? null : new BadRequestException('Only .csv is allowed'), ok);
      },
    }),
  )
  importCsv(@UploadedFile() file: MulterFile) {
    return this.service.importCsv(file);
  }

  @Get()
  @AllowRoles([AuthRole.ADMIN])
  list(@Query() q: PokemonQueryDto) {
    return this.service.list(q);
  }

  @Get(':id')
  @AllowRoles([AuthRole.ADMIN])
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.service.detail(id);
  }
}
