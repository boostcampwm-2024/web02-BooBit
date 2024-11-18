import { IsString, IsEnum } from 'class-validator';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';

export class SubscribeRequestDto {
  @IsString()
  event: string;

  @IsEnum(TimeScale)
  timeScale: string;
}
