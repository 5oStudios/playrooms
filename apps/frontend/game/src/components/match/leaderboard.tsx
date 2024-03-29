import {
  Avatar,
  ModalContent,
  ModalHeader,
  cn,
  useDisclosure,
} from '@nextui-org/react';

import { useAppSelector } from '../../hooks/use-redux-typed';
import BaseModal from '../modals/base-modal';

export function Leaderboard() {
  const players = useAppSelector((state) => state.players);
  const playersClone = [...players];
  const disclosure = useDisclosure({ defaultOpen: true });
  const session = useAppSelector((state) => state.session);
  const isMe = players.find((player) => player.user_id === session?.user_id);
  const matchState = useAppSelector((state) => state.match.currentMatchState);
  console.log(players);

  return (
    <BaseModal {...disclosure} size={'4xl'}>
      <ModalContent className={'w-full'}>
        <ModalHeader>
          <h1 className="text-3xl font-semibold px-4 py-6">
            <svg
              className="inline-block w-6 h-6 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 26"
              fill="none"
            >
              <path
                fill="#F26856"
                d="M21.215 1.428c-.744 0-1.438.213-2.024.579V.865c0-.478-.394-.865-.88-.865H6.69C6.204 0 5.81.387 5.81.865v1.142C5.224 1.641 4.53 1.428 3.785 1.428 1.698 1.428 0 3.097 0 5.148c0 2.052 1.698 3.721 3.785 3.721h1.453c.315 0 .572.252.572.562 0 .311-.257.563-.572.563-.486 0-.88.388-.88.865 0 .478.395.865.88.865.421 0 .816-.111 1.158-.303.318.865.761 1.647 1.318 2.31.686.814 1.515 1.425 2.433 1.808-.04.487-.154 1.349-.481 2.191-.591 1.519-1.564 2.257-2.975 2.257H5.238c-.486 0-.88.388-.88.865v4.283c0 .478.395.865.88.865h14.525c.485 0 .88-.388.88-.865v-4.283c0-.478-.395-.865-.88-.865h-1.452c-1.411 0-2.385-.738-2.975-2.257-.328-.843-.441-1.704-.482-2.191.918-.383 1.748-.993 2.434-1.808.557-.663 1-1.445 1.318-2.31.342.192.736.303 1.157.303.486 0 .88-.387.88-.865 0-.478-.394-.865-.88-.865-.315 0-.572-.252-.572-.563 0-.31.257-.562.572-.562h1.452C23.303 8.869 25 7.2 25 5.148c0-2.052-1.698-3.721-3.785-3.721z"
              />
            </svg>
            Leaderboard
          </h1>
        </ModalHeader>

        <div className="flex items-center justify-between px-4 py-3 bg-background/40 rounded-md w-full">
          <p className="text-sm font-semibold">Players</p>
          <p className="text-sm font-semibold">{players.length}</p>
        </div>

        <div className="flex flex-col gap-2 w-full max-h-96 overscroll-y-auto">
          {playersClone
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <div
                key={player.user_id}
                className={cn(
                  `flex items-center justify-between px-4 py-3 bg-background/40 rounded-md w-full`,
                  isMe && player.user_id === isMe.user_id && 'bg-blue-500',
                  index === 0 && 'bg-yellow-500',
                  index === 1 && 'bg-gray-500',
                  index === 2 && 'bg-rose-400',
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-700">
                    <Avatar
                      src={player?.avatar_url}
                      alt={player.username}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <p className="text-sm font-semibold">{player.username}</p>
                </div>
                <p className="text-sm font-semibold">{player.score}</p>
              </div>
            ))}
        </div>
      </ModalContent>
    </BaseModal>
  );
}
