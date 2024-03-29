import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { RxState } from '@rx-angular/state';
import { merge, Subject } from 'rxjs';
import { tag } from 'rxjs-spy/operators/tag';
import { tap } from 'rxjs/operators';
import { DeckImportDialogComponent } from './components/deck-import-dialog/deck-import-dialog.component';
import {
  deserialize,
  GlobalState,
  GLOBAL_RX_STATE,
  INITIAL_GLOBAL_STATE,
  serialize,
} from './global-state';
import { DispatchCardActionService } from './services/dispatch-card-action/dispatch-card-action.service';
import { PeerService } from './services/peer.service';

type State = Record<string, never>;

@Component({
  selector: 'digimon-card-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [RxState],
})
export class AppComponent implements OnInit {
  /**
   * constants
   */
  readonly title = 'vs-desktop-app';
  readonly localStorageKeyGlobalState = 'vs:globalstate';

  /**
   * state
   */
  readonly gs$ = this.globalState.select().pipe(
    tag('gs'),
    tap(() => {
      this.detectChange();
    })
  );

  /**
   * Events
   */
  readonly onReset$ = new Subject<void>();
  readonly onInitPlay$ = new Subject<void>();
  readonly onImportDeck$ = new Subject<void>();
  // TODO
  private readonly onResetMode$ = merge(this.onReset$);

  remoteId = new FormControl();
  myPeerId$ = this.peerService.peerId$;
  isConnected$ = this.peerService.isConnected$.pipe(
    tap(() => this.detectChange())
  );

  constructor(
    private readonly state: RxState<State>,
    @Inject(GLOBAL_RX_STATE) private readonly globalState: RxState<GlobalState>,
    private readonly dispatchCardActionService: DispatchCardActionService,
    private readonly dialog: MatDialog,
    private readonly peerService: PeerService,
    private cdRef: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {
    this.globalState.set(INITIAL_GLOBAL_STATE);
  }

  ngOnInit() {
    this.setInitState();

    this.state.hold(
      this.onReset$.pipe(
        tap(() =>
          this.dispatchCardActionService.dispatch({
            type: 'reset',
            area: 'whole',
          })
        )
      )
    );
    this.state.hold(
      this.onInitPlay$.pipe(
        tap(() => {
          this.dispatchCardActionService.dispatch({
            type: 'reset',
            area: 'whole',
          });
          this.dispatchCardActionService.dispatch({
            type: 'shuffle',
            area: 'digitamaStack',
          });
          this.dispatchCardActionService.dispatch({
            type: 'shuffle',
            area: 'stack',
          });
          new Array(5).fill(1).forEach(() => {
            this.dispatchCardActionService.dispatch({
              type: 'recovery',
              area: 'stack',
            });
          });
          new Array(5).fill(1).forEach(() => {
            this.dispatchCardActionService.dispatch({
              type: 'draw',
              area: 'stack',
            });
          });
        })
      )
    );
    this.state.hold(
      this.onImportDeck$.pipe(
        tap(() => {
          this.dialog.open(DeckImportDialogComponent);
        })
      )
    );

    this.state.hold(
      this.globalState.select().pipe(
        tap((state) => {
          const stringifyState = JSON.stringify(serialize(state));
          localStorage.setItem(this.localStorageKeyGlobalState, stringifyState);
        })
      )
    );

    this.globalState.connect('ui', this.onResetMode$, (state) => ({
      ...state.ui,
      modeState: undefined,
    }));
  }

  private setInitState() {
    const globalState = localStorage.getItem(this.localStorageKeyGlobalState);
    const initGlobalState = globalState
      ? deserialize(JSON.parse(globalState))
      : INITIAL_GLOBAL_STATE;
    this.globalState.set(() => initGlobalState);
  }

  connect() {
    this.peerService.connect(this.remoteId.value);
  }

  private detectChange() {
    // FIXME:
    // 画面上のイベントを発火させないと、画面の描画が更新されないことがある。
    // peerServiceでメッセージを受けとり、globalStateを更新したさには、画面描画が走らない。asyncPipeが反応してないように見える。
    // ChangeDetectorRefのdetectChange実行でも画面が更新されない。
    setTimeout(() => {
      const button = document.querySelector('#dummy-btn') as HTMLButtonElement;
      button.click();
      // これだと、相手のデジモン詳細ダイアログがうまく機能しない
      // this.cdRef.detectChanges();
    });
  }
}
