import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsString, ValidateNested, Matches } from 'class-validator';
import { Type, Transform } from 'class-transformer';


export class SpeedRangeDto {
  @ApiProperty()
  @Transform(({ value }) => (value ?? '').toString().trim())
  @IsString()
  label!: string;

  @ApiProperty()
  @Transform(({ value }) => (value ?? '').toString().trim())
  @IsString()
  value!: string;
}

export class PokemonConfigCreateDto {
  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => Array.isArray(value) ? value.map((s) => (s ?? '').toString().trim()) : [])
  @IsString({ each: true })
  types!: string[];

  @ApiProperty({
    type: [SpeedRangeDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SpeedRangeDto)
  speedRanges!: SpeedRangeDto[];
}
