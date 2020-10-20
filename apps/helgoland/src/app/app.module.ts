import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HelgolandCachingModule } from '@helgoland/caching';
import {
  DatasetApiInterface,
  DatasetApiV1ConnectorProvider,
  DatasetApiV2ConnectorProvider,
  DatasetApiV3ConnectorProvider,
  DatasetStaConnectorProvider,
  HelgolandCoreModule,
  SplittedDataDatasetApiInterface,
} from '@helgoland/core';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandDatasetlistModule, HelgolandLabelMapperModule } from '@helgoland/depiction';
import { HelgolandMapSelectorModule } from '@helgoland/map';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { LegendEntryComponent } from './components/legend-entry/legend-entry.component';
import {
  ModalDatasetByStationSelectorComponent,
} from './components/modal-dataset-by-station-selector/modal-dataset-by-station-selector.component';
import { ModalDiagramSettingsComponent } from './components/modal-diagram-settings/modal-diagram-settings.component';
import { ModalMapSettingsComponent } from './components/modal-map-settings/modal-map-settings.component';
import { PhenomenonListSelectorComponent } from './components/phenomenon-list-selector/phenomenon-list-selector.component';
import { ServiceListSelectorComponent } from './components/service-list-selector/service-list-selector.component';
import { MAP_SELECTION_ROUTE } from './services/app-router.service';
import { DiagramViewComponent } from './views/diagram-view/diagram-view.component';
import { MapSelectionViewComponent } from './views/map-selection-view/map-selection-view.component';

export function HttpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const ROUTES = [
  {
    path: MAP_SELECTION_ROUTE,
    component: MapSelectionViewComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    component: DiagramViewComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DiagramViewComponent,
    LegendEntryComponent,
    MapSelectionViewComponent,
    ModalDatasetByStationSelectorComponent,
    ModalDiagramSettingsComponent,
    ModalMapSettingsComponent,
    PhenomenonListSelectorComponent,
    ServiceListSelectorComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(ROUTES, { initialNavigation: 'enabled' }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpTranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    HelgolandCachingModule.forRoot({
      cachingDurationInMilliseconds: 300000,
      getDataCacheActive: false
    }),
    HelgolandCoreModule,
    HelgolandD3Module,
    HelgolandDatasetlistModule,
    HelgolandLabelMapperModule,
    HelgolandMapSelectorModule,
    HelgolandSelectorModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatToolbarModule,
  ],
  providers: [
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    },
    DatasetApiV1ConnectorProvider,
    DatasetApiV2ConnectorProvider,
    DatasetApiV3ConnectorProvider,
    DatasetStaConnectorProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
