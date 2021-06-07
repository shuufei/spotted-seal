import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { GlobalState, GLOBAL_RX_STATE } from '../../../global-state';
import { DispatchCardActionService } from '../../../services/dispatch-card-action/dispatch-card-action.service';
import { CardActionEvent, CardActionItem } from '../../card/card.component';

@Component({
  selector: 'digimon-card-app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class HandComponent implements OnInit {
  /**
   * Constants
   */
  readonly handCardActionList: CardActionItem[] = [
    {
      action: 'entry',
      displayText: '登場',
    },
    {
      action: 'evolution',
      displayText: '進化',
    },
    {
      action: 'trash',
      displayText: '破棄',
    },
    {
      action: 'addToEvolutionOrigin',
      displayText: '進化もとに追加',
    },
  ];

  /**
   * State
   */
  private readonly gs$ = this.globalState.select();
  readonly hand$ = this.globalState.select('playState', 'hand');

  /**
   * Events
   */
  readonly onAction$ = new Subject<CardActionEvent>();
  readonly onEvolution$ = this.onAction$.pipe(
    withLatestFrom(this.gs$),
    filter(
      ([event, gs]) =>
        event.action === 'evolution' &&
        (gs.playState.battleArea.digimonList.length > 0 ||
          gs.playState.standbyArea.digimon != null)
    ),
    map(([event]) => event)
  );

  private readonly onEntryAction$ = this.onAction$.pipe(
    filter((event) => event.action === 'entry')
  );
  private readonly onTrashAction$ = this.onAction$.pipe(
    filter((event) => event.action === 'trash')
  );
  private readonly onAddToEvolutionOrigin$ = this.onAction$.pipe(
    withLatestFrom(this.gs$),
    filter(
      ([event, gs]) =>
        event.action === 'addToEvolutionOrigin' &&
        gs.playState.battleArea.digimonList.length > 0
    ),
    map(([event]) => event)
  );

  constructor(
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>,
    private state: RxState<Record<string, never>>,
    private dispatchCardActionService: DispatchCardActionService
  ) {}

  ngOnInit(): void {
    this.state.hold(
      this.onEntryAction$.pipe(
        tap((event) => {
          this.dispatchCardActionService.dispatch({
            type: 'entry',
            area: 'hand',
            card: event.card,
          });
        })
      )
    );
    this.state.hold(
      this.onTrashAction$.pipe(
        tap((event) => {
          this.dispatchCardActionService.dispatch({
            type: 'trash',
            area: 'hand',
            card: event.card,
          });
        })
      )
    );

    this.globalState.connect('ui', this.onEvolution$, (state, event) => ({
      ...state.ui,
      modeState: {
        mode: 'evolution',
        trigger: {
          area: 'hand',
          card: event.card,
        },
      },
    }));
    this.globalState.connect(
      'ui',
      this.onAddToEvolutionOrigin$,
      (state, event) => ({
        ...state.ui,
        modeState: {
          mode: 'addToEvolutionOrigin',
          trigger: {
            area: 'hand',
            card: event.card,
          },
        },
      })
    );
  }
}
