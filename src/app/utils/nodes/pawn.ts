import { MAX_NUMBER } from '../../services/const';
import {
  AlphabetType,
  ChessLayout,
  NumberType,
  TeamType,
} from '../../services/types';
import { getNextAlphabet, getPreviousAlphabet } from '../path';

export const getHighlightForPawn = (
  data: ChessLayout,
  team: TeamType,
  alpha: AlphabetType,
  num: NumberType
) => {
  const targets: [AlphabetType, NumberType][] = [];
  if (team === 1) {
    if ((num as number) + 1 <= MAX_NUMBER) {
      if (!data[alpha][(num as number) + 1]) {
        targets.push([alpha, ((num as number) + 1) as NumberType]);
        if (
          num === 2 &&
          (num as number) + 2 <= MAX_NUMBER &&
          !data[alpha][(num as number) + 2]
        ) {
          targets.push([alpha, ((num as number) + 2) as NumberType]);
        }
      }

      const nextAlpha = getNextAlphabet(alpha);
      const prevAlpha = getPreviousAlphabet(alpha);

      if (nextAlpha) {
        if (data[nextAlpha][(num as number) + 1]?.team === 2) {
          targets.push([nextAlpha, ((num as number) + 1) as NumberType]);
        }
      }

      if (prevAlpha) {
        if (data[prevAlpha][(num as number) + 1]?.team === 2) {
          targets.push([prevAlpha, ((num as number) + 1) as NumberType]);
        }
      }
    }
  } else {
    if ((num as number) - 1 >= 1) {
      if (!data[alpha][(num as number) - 1]) {
        targets.push([alpha, ((num as number) - 1) as NumberType]);
        if (
          num === MAX_NUMBER - 1 &&
          (num as number) - 2 >= 1 &&
          !data[alpha][(num as number) - 2]
        ) {
          targets.push([alpha, ((num as number) - 2) as NumberType]);
        }
      }

      const nextAlpha = getNextAlphabet(alpha);
      const prevAlpha = getPreviousAlphabet(alpha);

      if (nextAlpha) {
        if (data[nextAlpha][(num as number) - 1]?.team === 1) {
          targets.push([nextAlpha, ((num as number) - 1) as NumberType]);
        }
      }

      if (prevAlpha) {
        if (data[prevAlpha][(num as number) - 1]?.team === 1) {
          targets.push([prevAlpha, ((num as number) - 1) as NumberType]);
        }
      }
    }
  }

  return targets;
};
