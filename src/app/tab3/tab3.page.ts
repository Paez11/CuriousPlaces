import { Component, ElementRef, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  constructor(){}
  map: Leaflet.Map;
  ubi_lat: Leaflet;
  ubi_long: Leaflet;

  ionViewDidEnter() {
    this.leafletMap();
  }

  leafletMap() {    
    this.map = new Leaflet.Map('mapId', {
      renderer: Leaflet.canvas()
    })
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(this.map);
    this.map.locate({
      setView: true,
      maxZoom: 15,
      timeout: 3000,
      enableHighAccuracy: true,
      maximumAge: 3600
    }).on('locationfound', (e) => {
      let markerGroup = Leaflet.featureGroup();
      this.ubi_lat = e.latitude;
      this.ubi_long = e.longitude;
      let marker = Leaflet.marker([e.latitude, e.longitude], {draggable: true}).on('dragend', (ev) => {
        var chagedPos = ev.target.getLatLng();
        this.ubi_lat = chagedPos.lat;
        this.ubi_long = chagedPos.lng;
      })
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
      }).on('locationerror', (err) => {
        alert(err.message);
    })
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}
