import { IsEnum } from 'class-validator';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';
import { WsBaseDto } from './ws.base.dto';

export class SubscribeRequestDto extends WsBaseDto {
  @IsEnum(TimeScale)
  timeScale: TimeScale;
}
