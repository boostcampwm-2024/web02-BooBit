import { CandleDataDto } from './candle.data.dto';
import { ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { WsBaseDto } from './ws.base.dto';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';

export class ChartResponseDto extends WsBaseDto {
  @IsEnum(TimeScale)
  timeScale: TimeScale;

  @ValidateNested({ each: true })
  @Type(() => CandleDataDto)
  data: CandleDataDto[];
}
