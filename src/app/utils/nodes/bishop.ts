import { MAX_NUMBER } from '../../services/const';
import {
  AlphabetType,
  ChessLayout,
  NumberType,
  TeamType,
} from '../../services/types';
import { getPossibleTargets } from './directionMatch';

export const getHighlightForBishop = (
  data: ChessLayout,
  team: TeamType,
  alpha: AlphabetType,
  num: NumberType
) => {
  const leftBottom = getPossibleTargets(data, alpha, num, team, -1, 1);
  const leftTop = getPossibleTargets(data, alpha, num, team, -1, -1);
  const rightBottom = getPossibleTargets(data, alpha, num, team, 1, 1);
  const rightTop = getPossibleTargets(data, alpha, num, team, 1, -1);

  return [
    ...(leftBottom || []),
    ...(leftTop || []),
    ...(rightBottom || []),
    ...(rightTop || []),
  ] as [AlphabetType, NumberType][];
};
