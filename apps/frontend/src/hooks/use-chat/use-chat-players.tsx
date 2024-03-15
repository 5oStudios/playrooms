import { usePubSub } from '../use-pub-sub';
import { useChat } from './use-chat';
import { PlayerPresenceEvents, PlayerPresenceMessageDTO } from '../use-player';
import { PLAYER_COMMANDS } from '../../components/match/match';

export const QuestionAnswerEventKeyFromChat = 'question_answer_from_chat';

export function useChatPlayers() {
  const { subscribe, publish } = usePubSub();
  const { messages } = useChat();

  const patterns = {
    A: /^a$/i,
    B: /^b$/i,
    C: /^c$/i,
    D: /^d$/i,
  };

  messages.forEach((messageChat) => {
    publish(
      PlayerPresenceEvents.JOINED,
      new PlayerPresenceMessageDTO({
        user_id: messageChat.id,
        username: messageChat.username,
      })
    );
  });

  messages.forEach((messageChat) => {
    Object.keys(patterns).forEach((pattern) => {
      onPatternMatch({
        message: messageChat.message,
        pattern: patterns[pattern],
        callback: (message) => {
          publish(QuestionAnswerEventKeyFromChat, {
            playerId: messageChat.id,
            abbreviation: message,
          });
        },
      });
    });
  });

  publish(PLAYER_COMMANDS.SYNC_SCORE, {});
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
  console.log('message', message);
  if (message.match(pattern)) {
    console.log('pattern matched', message);
    callback(message);
  }
};
