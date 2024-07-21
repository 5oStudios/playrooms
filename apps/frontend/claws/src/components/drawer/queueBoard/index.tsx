import { generateRandomUser } from '../../../app/mock/generateRandomUsers';
import QueueCard from './card';

export default function QueueBoard() {
  const users = generateRandomUser(20);
  return (
    <div className="mt-4 max-h-[650px] overflow-y-auto">
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
