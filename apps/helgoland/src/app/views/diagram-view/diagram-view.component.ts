import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatasetOptions, Time, Timespan } from '@helgoland/core';
import { D3PlotOptions, HoveringStyle } from '@helgoland/d3';

import {
  DiagramConfig,
  ModalDiagramSettingsComponent,
} from '../../components/modal-diagram-settings/modal-diagram-settings.component';
import { AppRouterService } from './../../services/app-router.service';
import { TimeseriesService } from './../../services/timeseries-service.service';

@Component({
  selector: 'helgoland-toolbox-diagram-view',
  templateUrl: './diagram-view.component.html',
  styleUrls: ['./diagram-view.component.scss']
})
export class DiagramViewComponent implements OnInit, OnDestroy {

  public mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  public datasetIds = [];

  public selectedIds: string[] = [];

  public datasetOptions: Map<string, DatasetOptions> = new Map();

  public d3diagramOptions: D3PlotOptions = {
    showReferenceValues: true,
    togglePanZoom: true,
    generalizeAllways: false,
    yaxis: true, // configurable
    showTimeLabel: false,
    hoverStyle: HoveringStyle.none,
    copyright: {
      label: 'This should be bottom right and the text is long.',
      link: 'https://52north.org/',
      positionX: 'right',
      positionY: 'bottom'
    },
    groupYaxis: true
  };

  public d3overviewOptions: D3PlotOptions = {
    overview: true,
    showTimeLabel: false
  };

  public diagramLoading: boolean;
  public overviewLoading: boolean;

  public diagramConfig: DiagramConfig = {
    overviewVisible: true,
    yaxisVisible: true,
    yaxisModifier: true,
    hoverstyle: 'none'
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private dialog: MatDialog,
    public timeseries: TimeseriesService,
    public appRouter: AppRouterService,
    private time: Time
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.timeseries.datasetIdsChanged.subscribe(list => this.setDatasets());
    this.setDatasets();
  }

  private setDatasets() {
    this.datasetIds = this.timeseries.datasetIds;
    this.datasetOptions = this.timeseries.datasetOptions;
  }

  public setSelected(selectedIds: string[]) {
    this.selectedIds = selectedIds;
  }

  public onDiagramLoading(loading: boolean) {
    setTimeout(() => this.diagramLoading = loading);
  }

  public onOverviewLoading(loading: boolean) {
    setTimeout(() => this.overviewLoading = loading);
  }

  public openDiagramSettings() {
    const dialogRef = this.dialog.open(ModalDiagramSettingsComponent, {
      data: {
        overviewVisible: this.diagramConfig.overviewVisible,
        yaxisVisible: this.diagramConfig.yaxisVisible,
        yaxisModifier: this.diagramConfig.yaxisModifier,
        hoverstyle: this.diagramConfig.hoverstyle
      } as DiagramConfig
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.diagramConfig = result;
        this.d3diagramOptions.hoverStyle = HoveringStyle[this.diagramConfig.hoverstyle];
        this.d3diagramOptions.yaxis = this.diagramConfig.yaxisVisible;
      }
    })
  }

  public jumpToDate(date: Date) {
    this.timeseries.timespan = this.time.centerTimespan(this.timeseries.timespan, date);
  }

  private updateTime(timespan: Timespan) {
    this.timeseries.timespan = timespan;
    // this.timeseriesService.setTimespan(timespan);
    // this.timespan = timespan;
  }

  public isSelected(internalId: string) {
    return this.selectedIds.find(e => e === internalId);
  }

  public selectTimeseries(selected: boolean, internalId: string) {
    if (selected) {
      this.selectedIds.push(internalId);
    } else {
      this.selectedIds.splice(this.selectedIds.findIndex(entry => entry === internalId), 1);
    }
  }

  public clearSelection() {
    this.selectedIds = [];
  }

  public removeAllTimeseries() {
    this.timeseries.removeAllDatasets();
  }

  public deleteTimeseries(internalId: string) {
    this.timeseries.removeDataset(internalId);
  }

  public showGeometry(geometry: GeoJSON.GeoJsonObject) {
    debugger;
  }

  public editOption(options: DatasetOptions) {
    debugger;
  }

  public updateOptions(options: DatasetOptions, internalId: string) {
    this.timeseries.updateDatasetOptions(options, internalId);
  }

}