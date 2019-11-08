/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { DefaultMapStyle } from 'src/app/models/default-map-style';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DefaultMapStyle]
})
export class SearchResultComponent implements OnInit {

  formGroup = new FormGroup({
    query: new FormControl(''),
    option: new FormControl(''),
  });

  // MAPS

  defaultLocation = { lat: 33.585639, lng: -101.873648 };
  zoom = 10;

  lat: number;
  lng: number;

  mapStyle: any[] = this.style.getStyle();
  // END MAPS

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private style: DefaultMapStyle,
    private loader: MapsAPILoader,
  ) { }

  ngOnInit() {
    const qParams = this.route.snapshot.queryParams;

    if (qParams.query && qParams.option) {
      this.formGroup.setValue(qParams);
    } else {
      this.router.navigate(['/'], { queryParams: qParams });
    }

    if (this.formGroup.value.query) {
      setTimeout(() => {
        this.search();
      }, 100);
    }
  }

  search() {
    this.getCoords(this.formGroup.value.query, (coordinates, status) => {
      if (status === 'OK') {
        this.lat = coordinates.lat();
        this.lng = coordinates.lng();
      } else {
        this.lat = this.defaultLocation.lat;
        this.lng = this.defaultLocation.lng;
      }
    });
  }

  getCoords(query, callback) {
    const geocoder = new google.maps.Geocoder();
    let coordinates;
    geocoder.geocode({ address: query }, (results, status) => {
      coordinates = results[0].geometry.location;
      callback(coordinates, status);
    });
  }

}
