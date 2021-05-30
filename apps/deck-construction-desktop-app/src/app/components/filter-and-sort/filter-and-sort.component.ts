import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GLOBAL_RX_STATE, GlobalState } from '../../global-state';
import { RxState } from '@rx-angular/state';
import { tap } from 'rxjs/operators';
import { COLOR } from '../../types';

@Component({
  selector: 'digimon-card-app-filter-and-sort',
  templateUrl: './filter-and-sort.component.html',
  styleUrls: ['./filter-and-sort.component.scss'],
})
export class FilterAndSortComponent implements OnInit {
  colorList = Object.keys(COLOR);
  readonly filter;

  constructor(
    private fb: FormBuilder,
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>
  ) {
    this.filter = this.fb.group({
      color: [],
    });
  }

  ngOnInit(): void {
    this.filter.valueChanges
      .pipe(
        tap((values) => {
          this.globalState.set('filter', () => {
            return {
              colorList: values.color,
            };
          });
        })
      )
      .subscribe();
    this.globalState.select('filter').pipe(
      tap((values) => {
        this.filter.setValue(
          {
            color: values.colorList,
          },
          {
            emitEvent: false,
          }
        );
      })
    ).subscribe();
  }
}