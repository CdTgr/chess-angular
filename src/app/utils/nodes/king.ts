import { MAX_NUMBER } from '../../services/const';
import {
  AlphabetType,
  ChessLayout,
  NumberType,
  TeamType,
} from '../../services/types';
import { getNextAlphabet, getPreviousAlphabet } from '../path';

const isFineToMove = (
  data: ChessLayout,
  alpha: AlphabetType,
  num: NumberType,
  team: TeamType
) => {
  return data[alpha]?.[num]?.team !== team;
};

export const getHighlightForKing = (
  data: ChessLayout,
  team: TeamType,
  alpha: AlphabetType,
  num: NumberType
) => {
  const targets: [AlphabetType, NumberType][] = [];

  const nextNum = (num as number) + 1;
  const prevNum = (num as number) - 1;
  const nextAlpha = getNextAlphabet(alpha);
  const prevAlpha = getPreviousAlphabet(alpha);

  // upwards
  if (nextNum <= MAX_NUMBER) {
    // up
    if (isFineToMove(data, alpha, nextNum as NumberType, team)) {
      targets.push([alpha, nextNum as NumberType]);
    }

    // up right
    if (
      nextAlpha &&
      isFineToMove(data, nextAlpha, nextNum as NumberType, team)
    ) {
      targets.push([nextAlpha, nextNum as NumberType]);
    }

    // up left
    if (
      prevAlpha &&
      isFineToMove(data, prevAlpha, nextNum as NumberType, team)
    ) {
      targets.push([prevAlpha, nextNum as NumberType]);
    }
  }

  // downwards
  if (prevNum >= 1) {
    // down
    if (isFineToMove(data, alpha, prevNum as NumberType, team)) {
      targets.push([alpha, prevNum as NumberType]);
    }

    // down right
    if (
      nextAlpha &&
      isFineToMove(data, nextAlpha, prevNum as NumberType, team)
    ) {
      targets.push([nextAlpha, prevNum as NumberType]);
    }

    // down left
    if (
      prevAlpha &&
      isFineToMove(data, prevAlpha, prevNum as NumberType, team)
    ) {
      targets.push([prevAlpha, prevNum as NumberType]);
    }
  }

  // right
  if (nextAlpha && isFineToMove(data, nextAlpha, num, team)) {
    targets.push([nextAlpha, num]);
  }

  // left
  if (prevAlpha && isFineToMove(data, prevAlpha, num, team)) {
    targets.push([prevAlpha, num]);
  }

  return targets;
};
