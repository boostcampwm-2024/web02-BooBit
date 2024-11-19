import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Reflector } from '@nestjs/core';
import * as WebSocket from 'ws';
import { WsService } from './ws.service';
import { WS_EVENT_HANDLER } from './decorators/ws.event.decorator';
import { WsError } from './ws.error';

export abstract class WsBaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    protected readonly wsService: WsService,
    private readonly reflector: Reflector,
  ) {}

  afterInit() {
    console.log(`WebSocket server initialized`);
  }

  handleConnection(client: WebSocket) {
    console.log('Client connected');
    client.on('message', (message) => this.handleMessage(client, message.toString()));
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected');
    this.wsService.removeClient(client);
  }

  private handleMessage(client: WebSocket, message: string) {
    try {
      const { event, ...data } = JSON.parse(message);

      const prototype = Object.getPrototypeOf(this);
      const methodNames = Object.getOwnPropertyNames(prototype);
      const handlers = methodNames.filter((methodName) => {
        const handlerEvent = this.reflector.get<string>(WS_EVENT_HANDLER, prototype[methodName]);
        return handlerEvent === event;
      });

      if (handlers.length === 0) {
        throw new WsError(event, `No handler found for event: ${event}`);
      }

      for (const handler of handlers) {
        this[handler](client, data);
      }
    } catch (err) {
      this.handleError(client, err);
    }
  }

  private handleError(client: WebSocket, err) {
    if (err instanceof WsError) {
      client.send(JSON.stringify({ event: err.event, error: err.message }));
    } else {
      client.send(JSON.stringify({ event: 'error', error: 'Invalid message format' }));
    }
  }
}
