import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GlobalState, GLOBAL_RX_STATE } from '../../../global-state';
import { DispatchCardActionService } from '../../../services/dispatch-card-action/dispatch-card-action.service';
import { CardActionEvent, CardActionItem } from '../../card/card.component';

@Component({
  selector: 'digimon-card-app-security-open-area',
  templateUrl: './security-open-area.component.html',
  styleUrls: ['./security-open-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityOpenAreaComponent implements OnInit {
  /**
   * Constants
   */
  readonly actionList: CardActionItem[] = [
    {
      action: 'trash',
      displayText: '破棄',
    },
    {
      action: 'entry',
      displayText: '登場',
    },
    {
      action: 'draw',
      displayText: '手札に加える',
    },
  ];

  /**
   * State
   */
  readonly securityOpenArea$ = this.globalState.select(
    'playState',
    'securityOpenArea'
  );

  /**
   * Event
   */
  readonly onAction$ = new Subject<CardActionEvent>();

  constructor(
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>,
    private state: RxState<Record<string, never>>,
    private dispatchCardActionService: DispatchCardActionService
  ) {}

  ngOnInit(): void {
    this.state.hold(
      this.onAction$.pipe(
        tap((event) => {
          this.dispatchCardActionService.dispatch({
            type: event.action,
            area: 'securityOpenArea',
            card: event.card,
          });
        })
      )
    );
  }
}
