import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ChessService } from './services/chess.service';
import { Subscription } from 'rxjs';
import {
  AlphabetType,
  ChessItem,
  ChessLayout,
  NumberType,
} from './services/types';
import { Dayjs } from 'dayjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('rook') rook!: TemplateRef<any>;
  @ViewChild('knight') knight!: TemplateRef<any>;
  @ViewChild('bishop') bishop!: TemplateRef<any>;
  @ViewChild('queen') queen!: TemplateRef<any>;
  @ViewChild('king') king!: TemplateRef<any>;
  @ViewChild('pawn') pawn!: TemplateRef<any>;

  title = 'Chess Board';
  items!: ChessLayout;
  selected: ChessItem | undefined = undefined;
  nextTeam: 1 | 2 = 1;
  lastMove: Dayjs | undefined = undefined;
  startFrom: Dayjs | undefined = undefined;

  private subscription: Subscription = new Subscription();

  constructor(public chess: ChessService, protected cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscription.add(
      this.chess.layout.subscribe((layout) => {
        this.items = layout;
        this.cd.detectChanges();
      })
    );
    this.subscription.add(
      this.chess.selected.subscribe((selected) => {
        this.selected = selected;
        this.cd.detectChanges();
      })
    );
    this.subscription.add(
      this.chess.nextTeam.subscribe((nextTeam) => {
        this.nextTeam = nextTeam;
      })
    );
    this.subscription.add(
      this.chess.lastMove.subscribe((lastMove) => {
        this.lastMove = lastMove;
        if (!this.startFrom) {
          this.startFrom = lastMove;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.chess
      .setItems({
        rook: this.rook,
        knight: this.knight,
        bishop: this.bishop,
        queen: this.queen,
        king: this.king,
        pawn: this.pawn,
      })
      .reset();
  }

  getItemClasses(item: ChessItem) {
    return [`team-${item.team}`, item.selected && 'selected'].filter(
      (f) => !!f
    );
  }

  trackerAlpha(index: number, item: AlphabetType) {
    return `${index}-${item}`;
  }
  trackerNum(index: number, item: NumberType) {
    return `${index}-${item}`;
  }

  selectItem(alphabet: AlphabetType, num: NumberType) {
    this.chess.select(alphabet, num, true);
  }

  getNode(alphabet: AlphabetType, num: NumberType): ChessItem | undefined {
    return this.items?.[alphabet]?.[num];
  }

  getPieceComponent(alphabet: AlphabetType, num: NumberType): TemplateRef<any> {
    return this.getNode(alphabet, num)?.piece?.component as TemplateRef<any>;
  }

  isDisabled(alpha: AlphabetType, num: NumberType): boolean {
    const node = this.getNode(alpha, num);

    if (!node) {
      return true;
    }
    if (node.highlighted) {
      return false;
    }
    if (node.team && node.team !== this.nextTeam) {
      return true;
    }
    return false;
  }
}
