import * as WebSocket from 'ws';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WsService {
  private timeScaleRoom: Map<string, Set<WebSocket>> = new Map();

  addClientToRoom(client: WebSocket, timeScale: string) {
    if (!this.timeScaleRoom.has(timeScale)) {
      this.timeScaleRoom.set(timeScale, new Set());
    }
    this.timeScaleRoom.get(timeScale)!.add(client);
  }

  removeClient(client: WebSocket) {
    for (const [timeScale, clients] of this.timeScaleRoom.entries()) {
      clients.delete(client);
      if (clients.size === 0) {
        this.timeScaleRoom.delete(timeScale);
      }
    }
  }

  broadcastToRoom(timeScale: string, data: any) {
    const clients = this.timeScaleRoom.get(timeScale);
    if (!clients) return;

    const message = JSON.stringify(data);
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  broadcastToAll(data: any) {
    const message = JSON.stringify(data);

    for (const clients of this.timeScaleRoom.values()) {
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      }
    }
  }
}
