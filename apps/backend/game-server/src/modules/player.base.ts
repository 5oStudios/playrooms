import { Schema, type } from '@colyseus/schema';
import { faker } from '@faker-js/faker';

export class Player extends Schema {
  @type('string')
  sessionId: string = faker.database.mongodbObjectId();

  @type('string')
  name: string = faker.person.fullName();

  @type('string')
  email: string = faker.internet.email();

  constructor(playerInfo: Partial<Player>) {
    super();
    Object.assign(this, playerInfo);
  }
}
