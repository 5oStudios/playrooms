import { Schema, type } from '@colyseus/schema';
import { faker } from '@faker-js/faker';

export class Player extends Schema {
  @type('string')
  id: string = faker.database.mongodbObjectId();

  @type('string')
  sessionId: string = faker.database.mongodbObjectId();

  @type('string')
  name: string = faker.person.firstName();

  constructor(playerInfo: Partial<Player>) {
    super();
    Object.assign(this, playerInfo);
  }
}
