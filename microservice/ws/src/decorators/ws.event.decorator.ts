import { SetMetadata } from '@nestjs/common';

export const WS_EVENT_HANDLER = 'WS_EVENT_HANDLER';

export const WsEventDecorator = (event: string): MethodDecorator => {
  return SetMetadata(WS_EVENT_HANDLER, event);
};
