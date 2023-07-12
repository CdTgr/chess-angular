import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BishopComponent } from './components/bishop/bishop.component';
import { KingComponent } from './components/king/king.component';
import { KnightComponent } from './components/knight/knight.component';
import { PawnComponent } from './components/pawn/pawn.component';
import { QueenComponent } from './components/queen/queen.component';
import { RookComponent } from './components/rook/rook.component';
import { TimerComponent } from './components/timer/timer.component';

@NgModule({
  declarations: [
    AppComponent,
    BishopComponent,
    KingComponent,
    KnightComponent,
    PawnComponent,
    QueenComponent,
    RookComponent,
    TimerComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
