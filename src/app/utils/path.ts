import { ALPHABETS } from '../services/const';
import { AlphabetType } from '../services/types';

export const getNextAlphabet = (
  alpha: AlphabetType
): AlphabetType | undefined => {
  const index = ALPHABETS.indexOf(alpha);

  return ALPHABETS[index + 1];
};

export const getPreviousAlphabet = (
  alpha: AlphabetType
): AlphabetType | undefined => {
  const index = ALPHABETS.indexOf(alpha);

  return ALPHABETS[index - 1];
};
