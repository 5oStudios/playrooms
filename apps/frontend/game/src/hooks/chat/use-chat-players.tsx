import { PLAYER_PRESENCE, PlayerPresenceMessageDTO } from '../use-player';
import { useAppSelector } from '../use-redux-typed';
import { MatchState } from '../../store/features/matchSlice';
import { ChatMessage } from '../../store/features/externalChatSlice';
import { patterns, QUESTION_EVENTS } from '../use-questions';
import { CHAT_EVENTS } from './use-chat';
import { publish, subscribe } from '@kingo/events';

export function useChatPlayers() {
  const players = useAppSelector((state) => state.players);
  const matchState = useAppSelector((state) => state.match.currentMatchState);

  subscribe(CHAT_EVENTS.RECEIVED_MESSAGE, (message: ChatMessage) => {
    if (!message.user) return;

    if (matchState === MatchState.READY) {
      console.log('match is ready');
      const isNewPlayer = players.every(
        (player) => player.user_id !== message.user.id
      );
      isNewPlayer &&
        publish(
          PLAYER_PRESENCE.JOINED,
          new PlayerPresenceMessageDTO({
            user_id: message.user.id,
            username: message.user.username,
          })
        );
    }

    if (matchState === MatchState.STARTED) {
      Object.keys(patterns).forEach((pattern) => {
        onPatternMatch({
          message: message.message.comment,
          pattern: patterns[pattern],
          callback: (matchedPattern) => {
            publish(QUESTION_EVENTS.ANSWERED, {
              playerId: message.user.id,
              abbreviation: matchedPattern,
              msgId: message.message.id,
            });
            console.log(
              'player answered',
              message.user.username,
              matchedPattern
            );
          },
        });
      });
    }
  });
}

const onPatternMatch = ({
  message,
  pattern,
  callback,
}: {
  message: string;
  pattern: RegExp;
  callback: (message: string) => void;
}) => {
  if (RegExp(pattern).exec(message)) {
    callback(message);
  }
};
