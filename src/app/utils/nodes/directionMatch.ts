import { MAX_NUMBER } from '../../services/const';
import {
  AlphabetType,
  ChessLayout,
  NumberType,
  TeamType,
} from '../../services/types';
import { getNextAlphabet, getPreviousAlphabet } from '../path';

export const isItPosssible = (
  data: ChessLayout,
  team: TeamType,
  alpha: AlphabetType,
  num: NumberType
): 1 | 2 | 3 => {
  if (data[alpha]?.[num]?.team === team) {
    return 1;
  }

  if (data[alpha]?.[num]?.team && data[alpha][num].team !== team) {
    return 2;
  }

  return 3;
};

export const getPossibleTargets = (
  data: ChessLayout,
  alpha: AlphabetType,
  num: NumberType,
  team: TeamType,
  x: 0 | 1 | -1,
  y: 0 | 1 | -1
): [AlphabetType, NumberType][] | null => {
  const yDir =
    x === 0
      ? alpha
      : x === 1
      ? getNextAlphabet(alpha)
      : getPreviousAlphabet(alpha);
  const xDir = (num as number) + y;

  if (!yDir || !xDir || xDir < 1 || xDir > MAX_NUMBER) {
    return null;
  }

  const possibility = isItPosssible(data, team, yDir, xDir as NumberType);
  switch (possibility) {
    case 1:
      return null;
    case 2:
      return [[yDir, xDir as NumberType]];
    case 3:
      const val: [AlphabetType, NumberType] = [yDir, xDir as NumberType];
      const next = getPossibleTargets(
        data,
        yDir,
        xDir as NumberType,
        team,
        x,
        y
      );

      return next ? [...next, val] : [val];
  }

  return null;
};
