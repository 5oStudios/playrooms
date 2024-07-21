import { generateRandomUser } from '../../../app/mock/generateRandomUsers';
import QueueCard from './card';

export default function QueueBoard() {
  const users = generateRandomUser(10);
  return (
    <div>
      {users.map((user, index) => (
        <QueueCard
          id={index}
          images={user.image}
          name={user.name}
          points={user.points}
        />
      ))}
    </div>
  );
}
