import { usePubSub } from '../use-pub-sub';
import { PlayerPresenceEvents, PlayerPresenceMessageDTO } from '../use-player';
import { useAppSelector } from '../use-redux-typed';
import { MatchState } from '../../store/features/matchSlice';
import { ChatMessage } from '../../store/features/externalChatSlice';
import { patterns } from '../use-questions';

export const QuestionAnswerEventKeyFromChat = 'question_answer_from_chat';

export const ChatMessageFromExternalPlatform =
  'chat_message_from_external_platform';

export function useChatPlayers() {
  const { subscribe, publish } = usePubSub();
  const players = useAppSelector((state) => state.players);
  const matchState = useAppSelector((state) => state.match.currentMatchState);

  subscribe({
    event: ChatMessageFromExternalPlatform,
    callback: (message: ChatMessage) => {
      if (matchState === MatchState.READY) {
        console.log('match is ready');
        const isNewPlayer = players.every(
          (player) => player.id !== message.user.id
        );
        isNewPlayer &&
          publish(
            PlayerPresenceEvents.JOINED,
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
              publish(QuestionAnswerEventKeyFromChat, {
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
    },
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
  if (message.match(pattern)) {
    callback(message);
  }
};
