import { faker } from '@faker-js/faker';

type User = {
  name: string;
  image: string;
  points: number;
};

export function generateRandomUser(length: number) {
  const users: User[] = [];
  for (let i = 0; i < length; i++) {
    users.push({
      name: faker.person.fullName(),
      image: faker.image.avatar(),
      points: faker.number.int({ min: 0, max: 100 }),
    });
  }
  return users;
}
