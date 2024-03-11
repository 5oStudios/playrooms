import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class LimiterService {
  private ipRequestCounts: Record<string, number> = {};
  private readonly maxIpConnections = 10;
  private readonly maxIpRequestsPerMinute = 5;

  constructor() {
    setInterval(() => {
      this.ipRequestCounts = {};
    }, 60 * 1000);
  }

  clientBlocked(io: any, currentSocket: Socket): boolean {
    const ipCounts = this.getOverallIpConnectionCounts(io);
    const currentIp = this.getSocketIp(currentSocket);

    if (typeof currentIp !== 'string') {
      console.info('LIMITER: Failed to retrieve socket IP.');
      return false;
    }

    const currentIpConnections = ipCounts[currentIp] || 0;
    const currentIpRequests = this.ipRequestCounts[currentIp] || 0;

    this.ipRequestCounts[currentIp] = currentIpRequests + 1;

    if (currentIpConnections > this.maxIpConnections) {
      console.info(
        `LIMITER: Max connection count of ${this.maxIpConnections} exceeded for client ${currentIp}`
      );
      return true;
    }

    if (currentIpRequests > this.maxIpRequestsPerMinute) {
      console.info(
        `LIMITER: Max request count of ${this.maxIpRequestsPerMinute} exceeded for client ${currentIp}`
      );
      return true;
    }

    return false;
  }

  private getOverallIpConnectionCounts(io: any): Record<string, number> {
    const ipCounts: Record<string, number> = {};

    io.of('/').sockets.forEach((socket: Socket) => {
      const ip = this.getSocketIp(socket);
      // @ts-expect-error - ip is a string
      ipCounts[ip] = (ipCounts[ip] || 0) + 1;
    });

    return ipCounts;
  }

  private getSocketIp(socket: Socket) {
    if (['::1', '::ffff:127.0.0.1'].includes(socket.handshake.address)) {
      return socket.handshake.headers['x-forwarded-for'];
    } else {
      return socket.handshake.address;
    }
  }
}
