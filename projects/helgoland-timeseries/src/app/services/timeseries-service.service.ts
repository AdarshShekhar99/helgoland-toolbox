import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Injectable, Optional } from '@angular/core';
import {
  BarRenderingHints,
  ColorService,
  DatasetOptions,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  LocalStorage,
  RenderingHintsDatasetService,
  Time,
  Timespan,
  TimezoneService,
} from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

const TIMESERIES_OPTIONS_CACHE_PARAM = 'timeseriesOptions';
const TIMESERIES_IDS_CACHE_PARAM = 'timeseriesIds';
const TIME_CACHE_PARAM = 'timeseriesTime';

@Injectable({
  providedIn: 'root'
})
export class TimeseriesService extends RenderingHintsDatasetService<DatasetOptions>{

  private _timespan: Timespan;

  constructor(
    protected serviceConnector: HelgolandServicesConnector,
    protected localStorage: LocalStorage,
    protected timeSrvc: Time,
    protected timezoneSrvc: TimezoneService,
    protected translate: TranslateService,
    protected la: LiveAnnouncer,
    @Optional() protected translateSrvc?: TranslateService
  ) {
    super(serviceConnector, translateSrvc);
    this.initTimespan();
    this.loadState();
  }

  public get timespan(): Timespan {
    return this._timespan;
  }

  public set timespan(ts: Timespan) {
    const message = `${this.translate.instant('events.timespan-changed-from')} ${this.timezoneSrvc.formatTzDate(ts.from)} ${this.translate.instant('events.timespan-changed-to')} ${this.timezoneSrvc.formatTzDate(ts.to)}`;
    this.la.announce(message);
    this._timespan = ts;
    this.timeSrvc.saveTimespan(TIME_CACHE_PARAM, this._timespan);
  }

  public removeAllDatasets() {
    super.removeAllDatasets();
    this.la.announce(this.translate.instant('events.all-timeseries-removed'));
  }

  protected async addLoadedDataset(timeseries: HelgolandTimeseries, resolve: (value?: boolean | PromiseLike<boolean>) => void) {
    super.addLoadedDataset(timeseries, resolve);
    const message = `${this.translate.instant('events.add-timeseries')}: ${timeseries.label}`;
    this.la.announce(message);
  }

  protected createStyles(internalId: string): DatasetOptions {
    const options = new DatasetOptions(internalId, new ColorService().getColor());
    options.generalize = false;
    options.lineWidth = 2;
    options.pointRadius = 2;
    return options;
  }

  protected handleBarRenderingHints(barHints: BarRenderingHints, options: DatasetOptions) {
    super.handleBarRenderingHints(barHints, options);
    options.yAxisRange = { min: 0 };
  }

  protected saveState(): void {
    this.localStorage.save(TIMESERIES_IDS_CACHE_PARAM, this.datasetIds);
    this.localStorage.save(TIMESERIES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
  }

  protected loadState(): void {
    const options = this.localStorage.loadArray<DatasetOptions>(TIMESERIES_OPTIONS_CACHE_PARAM);
    if (options && options.length) { options.forEach(e => this.datasetOptions.set(e.internalId, e)); }
    this.datasetIds = this.localStorage.loadArray<string>(TIMESERIES_IDS_CACHE_PARAM) || [];
  }

  private initTimespan() {
    if (!this._timespan) {
      this._timespan =
        this.timeSrvc.loadTimespan(TIME_CACHE_PARAM) ||
        this.timeSrvc.createByDurationWithEnd(moment.duration(1, 'days'), new Date(), 'day');
    }
  }

}