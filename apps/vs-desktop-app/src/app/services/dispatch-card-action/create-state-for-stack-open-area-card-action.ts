import { produce } from 'immer';
import * as _ from 'lodash';
import { Digimon } from '../../domain/digimon';
import { Tamer } from '../../domain/tamer';
import { GlobalState } from '../../global-state';
import { Card } from '../../types';
import { StateAction } from './dispatch-card-action.service';

export const createStateForStackOpenAreaCardAction = (
  action: StateAction,
  currentState: GlobalState
): GlobalState => {
  switch (action.type) {
    case 'draw':
      return onDraw(action, currentState);
    case 'addToBottomOfStack':
      return onAddToBottomOfStack(action, currentState);
    case 'trash':
      return onTrash(action, currentState);
    case 'entry':
      return onEntry(action, currentState);
    default:
      return currentState;
  }
};

const onDraw = (
  action: StateAction,
  currentState: GlobalState
): GlobalState => {
  if (action.card == null) return currentState;
  const card = action.card;
  return produce(currentState, (draft) => {
    _.remove(draft.playState.stackOpenArea.cardList, (v) => v.id === card.id);
    draft.playState.hand.cardList.push(card);
  });
};

const onAddToBottomOfStack = (
  action: StateAction,
  currentState: GlobalState
): GlobalState => {
  if (action.card == null) {
    return currentState;
  }
  const card: Card = action.card;
  return produce(currentState, (draft) => {
    _.remove(draft.playState.stackOpenArea.cardList, (v) => v.id === card.id);
    draft.playState.stack.cardList.push(card);
  });
};

const onTrash = (
  action: StateAction,
  currentState: GlobalState
): GlobalState => {
  if (action.card == null) {
    return currentState;
  }
  const card: Card = action.card;
  return produce(currentState, (draft) => {
    _.remove(draft.playState.stackOpenArea.cardList, (v) => v.id === card.id);
    draft.playState.trashArea.cardList.push(card);
  });
};

const onEntry = (
  action: StateAction,
  currentState: GlobalState
): GlobalState => {
  if (action.card == null) {
    return currentState;
  }
  const card: Card = action.card;
  const stackOpenAreaCardList = [
    ...currentState.playState.stackOpenArea.cardList,
  ];
  _.remove(stackOpenAreaCardList, (v) => v.id === card.id);
  const state: GlobalState = produce(currentState, (draft) => {
    draft.playState.stackOpenArea.cardList = stackOpenAreaCardList;
  });
  switch (action.card.cardtype) {
    case 'デジモン':
      return produce(state, (draft) => {
        draft.playState.battleArea.digimonList = [
          ...draft.playState.battleArea.digimonList,
          new Digimon(card),
        ];
      });
    case 'オプション':
      return produce(state, (draft) => {
        draft.playState.optionArea.cardList = [
          ...currentState.playState.optionArea.cardList,
          card,
        ];
      });
    case 'テイマー':
      return produce(state, (draft) => {
        draft.playState.tamerArea.tamerList = [
          ...currentState.playState.tamerArea.tamerList,
          new Tamer(card),
        ];
      });
    default:
      return state;
  }
};
