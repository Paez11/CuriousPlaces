import { Component, ElementRef, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  constructor(){}
  locationfound = Leaflet.icon({
    iconUrl: 'assets/icon/location.png',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });
  map: Leaflet.Map;
  ubi_lat: any;
  ubi_long: any;

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
    }).on('locationfound',(e) => {
      let markerGroup = Leaflet.featureGroup();
      this.ubi_lat = e.latitude;
      this.ubi_long = e.longitude;
      let marker = Leaflet.marker([e.latitude, e.longitude]).on('locationfound', (ev) => {
        var chagedPos = ev.target.getLatLng();
        this.ubi_lat = chagedPos.lat;
        this.ubi_long = chagedPos.lng;
      }).bindPopup('your current location').openPopup();
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
      }).on((err) => {
        alert(err.message);
    })
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}
