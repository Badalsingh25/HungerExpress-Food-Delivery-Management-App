import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  icon?: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container">
      <div #mapContainer class="map" [style.height]="height"></div>
    </div>
  `,
  styles: [`
    .map-container {
      width: 100%;
      position: relative;
    }
    .map {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() latitude: number = 28.6139; // Default: Delhi
  @Input() longitude: number = 77.2090;
  @Input() zoom: number = 15;
  @Input() height: string = '400px';
  @Input() markers: MapMarker[] = [];
  @Input() showRoute: boolean = false;

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map!: google.maps.Map;
  private markerObjects: google.maps.Marker[] = [];

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    if (!this.mapContainer) return;

    const mapOptions: google.maps.MapOptions = {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: this.zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    // Add markers
    if (this.markers.length > 0) {
      this.addMarkers();
    } else {
      // Add single marker at center
      new google.maps.Marker({
        position: { lat: this.latitude, lng: this.longitude },
        map: this.map,
        title: 'Location'
      });
    }
  }

  private addMarkers() {
    this.markers.forEach(marker => {
      const mapMarker = new google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: this.map,
        title: marker.title || 'Location',
        icon: marker.icon
      });
      this.markerObjects.push(mapMarker);
    });

    // Fit bounds to show all markers
    if (this.markers.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach(marker => {
        bounds.extend({ lat: marker.lat, lng: marker.lng });
      });
      this.map.fitBounds(bounds);
    }
  }
}
