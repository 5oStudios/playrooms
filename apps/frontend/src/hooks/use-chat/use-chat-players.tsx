import { usePubSub } from '../use-pub-sub';
import { useChat } from './use-chat';
import { PlayerPresenceEvents, PlayerPresenceMessageDTO } from '../use-player';
import { SOCKET_SYNC } from '../../components/match/match';
import { useState } from 'react';
import { useAppSelector } from '../use-redux-typed';
import { MatchState } from '../../store/features/matchSlice';

export const QuestionAnswerEventKeyFromChat = 'question_answer_from_chat';

export function useChatPlayers() {
  const { subscribe, publish } = usePubSub();
  const { messages } = useChat();
  const [playersAnsweredThisQuestion, setPlayersAnsweredThisQuestion] =
    useState<string[]>([]);
  const [playersJoined, setPlayersJoined] = useState<string[]>([]);
  const matchState = useAppSelector((state) => state.match.currentMatchState);

  const patterns = {
    A: /^a$/i,
    B: /^b$/i,
    C: /^c$/i,
    D: /^d$/i,
  };

  messages.forEach((messageChat) => {
    if (matchState !== MatchState.STARTED) return;
    if (playersJoined.includes(messageChat.id)) return;

    setPlayersJoined((prev) => [...prev, messageChat.id]);
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
          if (playersAnsweredThisQuestion.includes(messageChat.id)) return;
          if (matchState !== MatchState.STARTED) return;

          setPlayersAnsweredThisQuestion((prev) => [...prev, messageChat.id]);
          publish(QuestionAnswerEventKeyFromChat, {
            playerId: messageChat.id,
            abbreviation: message,
          });
        },
      });
    });
  });

  subscribe({
    event: SOCKET_SYNC.QUESTION_INDEX,
    callback: (decodedData: string) => {
      setPlayersAnsweredThisQuestion([]);
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
  console.log('message', message);
  if (message.match(pattern)) {
    console.log('pattern matched', message);
    callback(message);
  }
};
