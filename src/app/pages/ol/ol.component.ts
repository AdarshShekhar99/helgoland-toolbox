import { Component, OnInit } from '@angular/core';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';

import { OlMapService } from '../../components/ol/services/map.service';

@Component({
  selector: 'n52-ol',
  templateUrl: './ol.component.html',
  styleUrls: ['./ol.component.css']
})
export class OlComponent implements OnInit {

  public layers: BaseLayer[] = [];

  public mapId = 'test-map';

  constructor(
    private mapService: OlMapService
  ) { }

  ngOnInit() {

    this.layers.push(new TileLayer({
      source: new TileWMS({
        url: 'https://maps.dwd.de/geoserver/ows',
        params: {
          'LAYERS': 'dwd:RX-Produkt',
        }
      })
    }));

    this.layers.push(new TileLayer({
      source: new TileWMS({
        url: 'https://maps.dwd.de/geoserver/ows',
        params: {
          'LAYERS': 'dwd:FX-Produkt',
        }
      })
    }));

    // this.layers.push(new TileLayer({
    //   visible: false,
    //   source: new TileWMS({
    //     url: 'https://maps.dwd.de/geoserver/ows',
    //     params: {
    //       'LAYERS': 'dwd:Warngebiete_Binnenseen',
    //     }
    //   })
    // }));

    // this.layers.push(new TileLayer({
    //   visible: false,
    //   source: new TileWMS({
    //     url: 'https://maps.dwd.de/geoserver/ows',
    //     params: {
    //       'LAYERS': 'dwd:Pollenflug_Birke',
    //     }
    //   })
    // }));

    // this.layers.push(new TileLayer({
    //   visible: false,
    //   source: new TileWMS({
    //     url: 'https://maps.dwd.de/geoserver/ows',
    //     params: {
    //       'LAYERS': 'dwd:icon_t_2m',
    //     }
    //   })
    // }));

  }

  public getLegendUrl(legendUrl: string) {
    alert(legendUrl);
    console.log(legendUrl);
  }

  public removeLayer(i: number) {
    const layer = this.layers.splice(i, 1);
    this.mapService.getMap(this.mapId).subscribe(map => map.removeLayer(layer[0]));
  }

}