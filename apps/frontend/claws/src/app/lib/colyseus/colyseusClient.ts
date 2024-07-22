import { Client, RoomAvailable } from 'colyseus.js';

export class ColyseusClient {
  private gameClient: Client;
  private player: any;
  constructor() {
    this.gameClient = new Client('ws://localhost:3000');
  }

  // Method to fetch available rooms
  async getAvailableRooms(): Promise<RoomAvailable<any>[]> {
    const rooms = await this.gameClient.getAvailableRooms();
    return rooms;
  }
  // Method to create a new room

  async joinById(id: string) {
    const client = await this.gameClient.joinById(id);
    this.player = client;
    console.log('joined successfully', client);
  }
  async move(direction: string) {
    this.player.send('move-claw', { direction });
  }
}
