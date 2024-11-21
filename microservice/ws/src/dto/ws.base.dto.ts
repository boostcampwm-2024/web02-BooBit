import { IsEnum } from 'class-validator';
import { WsEvent } from '@app/common/enums/ws-event.enum';

export class WsBaseDto {
  @IsEnum(WsEvent)
  event: WsEvent;
}
