import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Dayjs } from 'dayjs';
import { Subscription } from 'rxjs';
import { ChessService } from '../../services/chess.service';
import { padStart } from 'lodash';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input('past') past: Dayjs | undefined = undefined;

  private now: Dayjs = dayjs();
  private timer!: number;

  ngOnInit(): void {
    const timer = setInterval(() => {
      this.now = dayjs();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  get hour(): string {
    if (this.past) {
      return padStart(dayjs().diff(this.past, 'hour').toString(), 2, '0');
    }

    return '00';
  }

  get minute(): string {
    if (this.past) {
      return padStart(dayjs().diff(this.past, 'minute').toString(), 2, '0');
    }

    return '00';
  }

  get second(): string {
    if (this.past) {
      return padStart(dayjs().diff(this.past, 'second').toString(), 2, '0');
    }

    return '00';
  }
}
