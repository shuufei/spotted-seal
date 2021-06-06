import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { AngularMaterialModule } from './angular-material.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { DigimonComponent } from './components/digimon/digimon.component';
import { ExpandCardViewDialogComponent } from './components/expand-card-view-dialog/expand-card-view-dialog.component';
import { CustomMenueTriggerDirective } from './custom-menu-trigger.directive';
import { GlobalState, GLOBAL_RX_STATE } from './global-state';
import { ArrayReversePipe } from './pipes/array-reverse.pipe';
import { StackComponent } from './components/area/stack/stack.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomMenueTriggerDirective,
    CardComponent,
    ExpandCardViewDialogComponent,
    DigimonComponent,
    ArrayReversePipe,
    StackComponent,
  ],
  imports: [
    AngularMaterialModule,
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
  ],
  providers: [
    {
      provide: GLOBAL_RX_STATE,
      useFactory: () => new RxState<GlobalState>(),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}