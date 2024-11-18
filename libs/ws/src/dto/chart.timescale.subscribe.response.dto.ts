import { CandleDataDto } from './candle.data.dto';
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SubscribeResponseDto {
  @IsString()
  event: string;

  @IsString()
  timeScale: string;

  @ValidateNested({ each: true })
  @Type(() => CandleDataDto)
  data: CandleDataDto[];
}
