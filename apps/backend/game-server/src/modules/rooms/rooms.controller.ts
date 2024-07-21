import { Controller, Get } from '@nestjs/common';
import { Client } from 'colyseus.js';

@Controller('rooms')
export class RoomsController{
  client: any;

  constructor() {
    this.client = new Client(`ws://localhost:${3000}`);
  }

  @Get()
  async getRooms(){
    return await this.client.getAvailableRooms();
  }
}
