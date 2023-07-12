import { TemplateRef } from '@angular/core';
import { ALPHABETS, NUMBERS, PieceEnum } from './const';

export type PieceType = (typeof PieceEnum)[keyof typeof PieceEnum];

export type Piece = {
  name: PieceType;
  component: TemplateRef<any>;
};

export type TeamType = 1 | 2;

export type ChessItem = {
  id: string;
  selected?: boolean;
  highlighted?: boolean;
  team?: TeamType;
  piece?: Piece;
};

export type AlphabetType = (typeof ALPHABETS)[number];
export type NumberType = (typeof NUMBERS)[number];

export type ChessLayout = Record<AlphabetType, Record<number, ChessItem>>;

type HistoryOne = {
  item?: ChessItem;
  position: {
    alphabet: AlphabetType;
    number: NumberType;
  };
};

export type HistoryItem = {
  removed: HistoryOne;
  added: HistoryOne;
};
