import { publish, useSubscribeIf } from '@kingo/events';

import {
  ChatAnswerState,
  ChatMessage,
  editMessageMeta,
} from '../../lib/features/externalChatSlice';
import { MatchState } from '../../lib/features/matchSlice';
import { PLAYER_PRESENCE, PlayerPresenceMessageDTO } from '../use-player';
import { QUESTION_EVENTS, patterns } from '../use-questions';
import { useAppDispatch, useAppSelector } from '../use-redux-typed';
import { CHAT_ANSWER_EVENTS, CHAT_EVENTS } from './use-chat';

export function useChatPlayers() {
  const players = useAppSelector((state) => state.players);
  const matchState = useAppSelector((state) => state.match.currentMatchState);
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const dispatch = useAppDispatch();

  useSubscribeIf(
    amIHost && matchState === MatchState.READY,
    CHAT_EVENTS.RECEIVED_MESSAGE,
    (message: ChatMessage) => {
      if (!message.user) return;
      if (matchState == MatchState.READY) {
        const isNewPlayer = players.every(
          (player) => player.user_id !== message.user.id,
        );
        isNewPlayer &&
          publish(
            PLAYER_PRESENCE.JOINED,
            new PlayerPresenceMessageDTO({
              user_id: message.user.id,
              username: message.user.username,
            }),
          );
      }
    },
  );

  useSubscribeIf(
    amIHost && matchState === MatchState.STARTED,
    CHAT_EVENTS.RECEIVED_MESSAGE,
    (message: ChatMessage) => {
      if (!message.user) return;
      if (matchState !== MatchState.STARTED) return;

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
              matchedPattern,
            );
          },
        });
      });
    },
  );

  useSubscribeIf(
    amIHost,
    CHAT_ANSWER_EVENTS.PROCESSING,
    ({ msgId }: { msgId: string }) =>
      dispatch(
        editMessageMeta({
          id: msgId,
          meta: { state: ChatAnswerState.PROCESSING },
        }),
      ),
  );

  useSubscribeIf(
    amIHost,
    CHAT_ANSWER_EVENTS.FINISHED_PROCESSING,
    ({ msgId, isCorrect }: { msgId: string; isCorrect: boolean }) => {
      console.log('finished processing', msgId, isCorrect);
      dispatch(
        editMessageMeta({
          id: msgId,
          meta: {
            state: ChatAnswerState.FINISHED_PROCESSING,
            isCorrectAnswer: isCorrect,
          },
        }),
      );
    },
  );
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
