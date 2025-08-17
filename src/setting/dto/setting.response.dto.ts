import { ApiProperty } from '@nestjs/swagger';
import { SpeedRangeDto } from './setting,create.dto';

export class PokemonConfigResponseDto {
  @ApiProperty({ type: [String] })
  types!: string[];

  @ApiProperty({ type: [SpeedRangeDto] })
  speedRanges!: SpeedRangeDto[];
}