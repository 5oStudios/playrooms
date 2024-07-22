import { Schema, type } from '@colyseus/schema';
import { faker } from '@faker-js/faker';
import { Client } from 'colyseus';

export class Player extends Schema {
  @type('string')
  sessionId: string = faker.database.mongodbObjectId();

  @type('string')
  name: string = faker.person.fullName();

  @type('string')
  email: string = faker.internet.email();

  constructor(client: Client) {
    super();
    this.sessionId = client.sessionId || this.sessionId;
    this.name = client.auth?.name || this.name;
    this.email = client.auth?.email || this.email;
  }
}
