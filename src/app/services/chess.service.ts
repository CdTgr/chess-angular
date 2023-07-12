import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  AlphabetType,
  ChessItem,
  ChessLayout,
  HistoryItem,
  NumberType,
  Piece,
  TeamType,
} from './types';
import { ALPHABETS, NUMBERS, PieceEnum } from './const';
import { v4 as uuidv4 } from 'uuid';
import {
  getHighlightForBishop,
  getHighlightForKing,
  getHighlightForKnight,
  getHighlightForPawn,
  getHighlightForQueen,
  getHighlightForRook,
} from '../utils/nodes';
import { includes, omit } from 'lodash';
import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class ChessService {
  public layout = new BehaviorSubject<ChessLayout>({} as ChessLayout);
  public selected = new BehaviorSubject<ChessItem | undefined>(undefined);
  public selectedPosition = new BehaviorSubject<
    | {
        alphabet: AlphabetType;
        number: NumberType;
      }
    | undefined
  >(undefined);
  public alphabets = ALPHABETS;
  public numbers = NUMBERS;
  public nextTeam = new BehaviorSubject<TeamType>(1);
  public lastMove = new BehaviorSubject<Dayjs | undefined>(undefined);
  public history: { undo: HistoryItem[]; redo: HistoryItem[] } = {
    undo: [],
    redo: [],
  };

  private _layout!: ChessLayout;
  private _rook!: TemplateRef<any>;
  private _knight!: TemplateRef<any>;
  private _bishop!: TemplateRef<any>;
  private _queen!: TemplateRef<any>;
  private _king!: TemplateRef<any>;
  private _pawn!: TemplateRef<any>;

  constructor() {}

  setItems({
    rook,
    knight,
    bishop,
    queen,
    king,
    pawn,
  }: {
    rook: TemplateRef<any>;
    knight: TemplateRef<any>;
    bishop: TemplateRef<any>;
    queen: TemplateRef<any>;
    king: TemplateRef<any>;
    pawn: TemplateRef<any>;
  }) {
    this._rook = rook;
    this._knight = knight;
    this._bishop = bishop;
    this._queen = queen;
    this._king = king;
    this._pawn = pawn;

    return this;
  }

  private _render() {
    this.layout.next(this._layout);

    return this;
  }

  private _resetFieldItem(piece: Piece): Record<number, ChessItem> {
    return {
      1: {
        id: uuidv4(),
        team: 1,
        piece,
      },
      2: {
        id: uuidv4(),
        team: 1,
        piece: { component: this._pawn, name: PieceEnum.pawn },
      },
      7: {
        id: uuidv4(),
        team: 2,
        piece: { component: this._pawn, name: PieceEnum.pawn },
      },
      8: {
        id: uuidv4(),
        team: 2,
        piece,
      },
    };
  }

  reset() {
    this._layout = {
      a: this._resetFieldItem({ component: this._rook, name: PieceEnum.rook }),
      b: this._resetFieldItem({
        component: this._knight,
        name: PieceEnum.knight,
      }),
      c: this._resetFieldItem({
        component: this._bishop,
        name: PieceEnum.bishop,
      }),
      d: this._resetFieldItem({
        component: this._queen,
        name: PieceEnum.queen,
      }),
      e: this._resetFieldItem({ component: this._king, name: PieceEnum.king }),
      f: this._resetFieldItem({
        component: this._bishop,
        name: PieceEnum.bishop,
      }),
      g: this._resetFieldItem({
        component: this._knight,
        name: PieceEnum.knight,
      }),
      h: this._resetFieldItem({ component: this._rook, name: PieceEnum.rook }),
    };
    this.selected.next(undefined);
    this.selectedPosition.next(undefined);
    this.lastMove.next(undefined);
    this.nextTeam.next(1);

    return this._render();
  }

  private _clearActions(deleteSelected = false) {
    for (const alphaKey in this._layout) {
      const item = this._layout[alphaKey as AlphabetType];
      for (const numKey in item) {
        if (
          deleteSelected &&
          this.selected.value &&
          this.selected.value.id === item[numKey].id
        ) {
          delete this._layout[alphaKey as AlphabetType][numKey];
        } else {
          delete this._layout[alphaKey as AlphabetType][numKey].selected;
          delete this._layout[alphaKey as AlphabetType][numKey].highlighted;
          if (!this._layout[alphaKey as AlphabetType][numKey].team) {
            delete this._layout[alphaKey as AlphabetType][numKey];
          }
        }
      }
    }

    return this;
  }

  private _highlightHint(
    item: ChessItem,
    alpha?: AlphabetType,
    num?: NumberType,
    render = false
  ): this {
    const { piece, team } = item;
    const targets: [AlphabetType, NumberType][] = [];

    if (!alpha || typeof num === undefined) {
      return render ? this._render() : this;
    }

    switch (piece?.name) {
      case PieceEnum.pawn:
        targets.push(
          ...getHighlightForPawn(
            this._layout,
            team as TeamType,
            alpha,
            num as NumberType
          )
        );
        break;
      case PieceEnum.king:
        targets.push(
          ...getHighlightForKing(
            this._layout,
            team as TeamType,
            alpha,
            num as NumberType
          )
        );
        break;
      case PieceEnum.bishop:
        targets.push(
          ...getHighlightForBishop(
            this._layout,
            team as TeamType,
            alpha,
            num as NumberType
          )
        );
        break;
      case PieceEnum.rook:
        targets.push(
          ...getHighlightForRook(
            this._layout,
            team as TeamType,
            alpha,
            num as NumberType
          )
        );
        break;
      case PieceEnum.queen:
        targets.push(
          ...getHighlightForQueen(
            this._layout,
            team as TeamType,
            alpha,
            num as NumberType
          )
        );
        break;
      case PieceEnum.knight:
        targets.push(
          ...getHighlightForKnight(
            this._layout,
            team as TeamType,
            alpha,
            num as NumberType
          )
        );
        break;
    }

    this.highLight(); // to clear all
    for (const [alphaItem, numItem] of targets) {
      this.highLight(alphaItem, numItem, false, false);
    }

    return render ? this._render() : this;
  }

  select(alpha?: AlphabetType, num?: NumberType, render = false): this {
    if (this.selected.value && alpha && typeof num !== undefined) {
      const current = this._layout[alpha as AlphabetType][num as NumberType];
      if (current?.highlighted) {
        this._clearActions();

        return this._move(alpha, num as NumberType, false);
      }
    }

    this._clearActions();
    if (alpha && typeof num !== undefined) {
      this._layout[alpha][num as NumberType].selected = true;
      this._highlightHint(this._layout[alpha][num as NumberType], alpha, num);
      this.selected.next(this._layout[alpha][num as NumberType]);
      this.selectedPosition.next({
        alphabet: alpha,
        number: num as NumberType,
      });
    } else {
      this.selected.next(undefined);
      this.selectedPosition.next(undefined);
    }

    if (!this.lastMove.value) {
      this.lastMove.next(dayjs());
    }

    return render ? this._render() : this;
  }

  highLight(
    alpha?: AlphabetType,
    num?: NumberType,
    clearOther = true,
    render = false
  ): this {
    if (clearOther) {
      for (const alphaKey in this._layout) {
        const item = this._layout[alphaKey as AlphabetType];
        for (const numKey in item) {
          delete this._layout[alphaKey as AlphabetType][numKey].highlighted;
          if (!this._layout[alphaKey as AlphabetType][numKey].team) {
            delete this._layout[alphaKey as AlphabetType][numKey];
          }
        }
      }
    }

    if (alpha && typeof num !== undefined) {
      const toHighLight =
        this._layout[alpha as AlphabetType][num as NumberType];

      if (toHighLight) {
        this._layout[alpha as AlphabetType][num as NumberType].highlighted =
          true;
      } else {
        if (!this._layout[alpha as AlphabetType]) {
          this._layout[alpha as AlphabetType] = {};
        }
        this._layout[alpha as AlphabetType][num as NumberType] = {
          id: uuidv4(),
          highlighted: true,
        };
      }
    }

    return render ? this._render() : this;
  }

  private _move(alpha: AlphabetType, num: NumberType, render = false): this {
    const item = this.selected.value as ChessItem;

    const inColumn = this._layout[alpha][num];
    this.history.undo.push({
      removed: {
        item: inColumn,
        position: {
          alphabet: alpha,
          number: num,
        },
      },
      added: {
        item,
        position: {
          alphabet: this.selectedPosition.value?.alphabet as AlphabetType,
          number: this.selectedPosition.value?.number as NumberType,
        },
      },
    });

    this.history.redo.splice(0, this.history.redo.length);

    this._clearActions(true);
    this._layout[alpha][num] = omit(item, ['selected', 'highlighted']);

    this._isCheck();

    this.nextTeam.next(item.team === 1 ? 2 : 1);

    this.lastMove.next(dayjs());

    return render ? this._render() : this;
  }

  private _isCheck() {
    // check mate and check check.
  }

  undo() {
    const undo = this.history.undo.pop();

    console.log({ undo });

    if (!undo) {
      return this;
    }

    if (undo.added.item) {
      this._layout[undo.added.position.alphabet][undo.added.position.number] =
        undo.added.item;
    } else {
      delete this._layout[undo.added.position.alphabet][
        undo.added.position.number
      ];
    }

    if (undo.removed.item) {
      this._layout[undo.removed.position.alphabet][
        undo.removed.position.number
      ] = undo.removed.item;
    } else {
      delete this._layout[undo.removed.position.alphabet][
        undo.removed.position.number
      ];
    }

    this.history.redo.push(undo);
    this.nextTeam.next(this.nextTeam.value === 1 ? 2 : 1);

    return this._render();
  }

  redo() {
    const redo = this.history.redo.pop();

    if (!redo) {
      return this;
    }

    if (redo.added.item) {
      this._layout[redo.added.position.alphabet][redo.added.position.number] =
        redo.added.item;
    } else {
      delete this._layout[redo.added.position.alphabet][
        redo.added.position.number
      ];
    }

    if (redo.removed.item) {
      this._layout[redo.removed.position.alphabet][
        redo.removed.position.number
      ] = redo.removed.item;
    } else {
      delete this._layout[redo.removed.position.alphabet][
        redo.removed.position.number
      ];
    }

    this.history.undo.push(redo);
    this.nextTeam.next(this.nextTeam.value === 1 ? 2 : 1);

    return this._render();
  }
}
