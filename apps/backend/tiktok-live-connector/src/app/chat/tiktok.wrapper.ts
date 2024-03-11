// import { Injectable } from '@nestjs/common';
// import { EventEmitter } from 'events';
// import { WebcastPushConnection } from 'tiktok-live-connector';
//
// @Injectable()
// export class TikTokConnectionWrapper extends EventEmitter {
//   private globalConnectionCount = 0;
//   private reconnectEnabled = true;
//   private reconnectCount = 0;
//   private reconnectWaitMs = 1000;
//   private maxReconnectAttempts = 5;
//   private connection: WebcastPushConnection;
//   private clientDisconnected = false;
//
//   constructor(
//     private readonly uniqueId: string,
//     private readonly options?: any,
//     private readonly enableLog?: boolean
//   ) {
//     super();
//   }
//
//   connect(isReconnect: boolean): void {
//     this.connection
//       .connect()
//       .then((state: any) => {
//         this.log(
//           `${isReconnect ? 'Reconnected' : 'Connected'} to roomId ${
//             state.roomId
//           }, websocket: ${state.upgradedToWebsocket}`
//         );
//         this.globalConnectionCount += 1;
//         this.resetReconnectVars();
//
//         if (this.clientDisconnected) {
//           this.connection.disconnect();
//           return;
//         }
//
//         if (!isReconnect) {
//           this.emit('connected', state);
//         }
//       })
//       .catch((err: any) => {
//         this.log(`${isReconnect ? 'Reconnect' : 'Connection'} failed, ${err}`);
//
//         if (isReconnect) {
//           this.scheduleReconnect(err);
//         } else {
//           this.emit('disconnected', err.toString());
//         }
//       });
//   }
//
//   scheduleReconnect(reason?: any): void {
//     if (!this.reconnectEnabled) {
//       return;
//     }
//
//     if (this.reconnectCount >= this.maxReconnectAttempts) {
//       this.log(`Give up connection, max reconnect attempts exceeded`);
//       this.emit('disconnected', `Connection lost. ${reason}`);
//       return;
//     }
//
//     this.log(`Try reconnect in ${this.reconnectWaitMs}ms`);
//
//     setTimeout(() => {
//       if (
//         !this.reconnectEnabled ||
//         this.reconnectCount >= this.maxReconnectAttempts
//       ) {
//         return;
//       }
//
//       this.reconnectCount += 1;
//       this.reconnectWaitMs *= 2;
//       this.connect(true);
//     }, this.reconnectWaitMs);
//   }
//
//   disconnect(): void {
//     this.log(`Client connection disconnected`);
//     this.clientDisconnected = true;
//     this.reconnectEnabled = false;
//
//     this.connection.disconnect();
//   }
//
//   private resetReconnectVars(): void {
//     this.reconnectCount = 0;
//     this.reconnectWaitMs = 1000;
//   }
//
//   private log(logString: string): void {
//     if (this.enableLog) {
//       console.log(`WRAPPER @${this.uniqueId}: ${logString}`);
//     }
//   }
// }
