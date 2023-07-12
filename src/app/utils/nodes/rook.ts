import {
  AlphabetType,
  ChessLayout,
  NumberType,
  TeamType,
} from '../../services/types';
import { getPossibleTargets } from './directionMatch';

export const getHighlightForRook = (
  data: ChessLayout,
  team: TeamType,
  alpha: AlphabetType,
  num: NumberType
) => {
  const bottom = getPossibleTargets(data, alpha, num, team, -1, 0);
  const top = getPossibleTargets(data, alpha, num, team, 1, 0);
  const right = getPossibleTargets(data, alpha, num, team, 0, 1);
  const left = getPossibleTargets(data, alpha, num, team, 0, -1);

  return [
    ...(bottom || []),
    ...(top || []),
    ...(right || []),
    ...(left || []),
  ] as [AlphabetType, NumberType][];
};
