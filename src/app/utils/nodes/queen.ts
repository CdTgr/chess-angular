import { MAX_NUMBER } from '../../services/const';
import {
  AlphabetType,
  ChessLayout,
  NumberType,
  TeamType,
} from '../../services/types';
import { getPossibleTargets } from './directionMatch';

export const getHighlightForQueen = (
  data: ChessLayout,
  team: TeamType,
  alpha: AlphabetType,
  num: NumberType
) => {
  const leftBottom = getPossibleTargets(data, alpha, num, team, -1, 1);
  const leftTop = getPossibleTargets(data, alpha, num, team, -1, -1);
  const rightBottom = getPossibleTargets(data, alpha, num, team, 1, 1);
  const rightTop = getPossibleTargets(data, alpha, num, team, 1, -1);
  const bottom = getPossibleTargets(data, alpha, num, team, -1, 0);
  const top = getPossibleTargets(data, alpha, num, team, 1, 0);
  const right = getPossibleTargets(data, alpha, num, team, 0, 1);
  const left = getPossibleTargets(data, alpha, num, team, 0, -1);

  return [
    ...(leftBottom || []),
    ...(leftTop || []),
    ...(rightBottom || []),
    ...(rightTop || []),
    ...(bottom || []),
    ...(top || []),
    ...(right || []),
    ...(left || []),
  ] as [AlphabetType, NumberType][];
};
