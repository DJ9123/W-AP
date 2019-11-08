/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { DefaultMapStyle } from 'src/app/models/default-map-style';
import { MapsAPILoader } from '@agm/core';
import { BehaviorSubject, Subject } from 'rxjs';

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
  isReadySubject = new Subject();
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
      this.isReadySubject.subscribe(() => this.search());
      this.searchWhenDefined(() => this.isReadySubject.next());
    }
  }

  searchWhenDefined(callback) {
    if (typeof google !== 'undefined') {
      callback();
    } else {
      setTimeout(this.searchWhenDefined, 100, callback);
    }
  }

  search() {
    this.router.navigate([], { queryParams: this.formGroup.value });
    this.getResponse(this.formGroup.value.query, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        this.lat = location.lat();
        this.lng = location.lng();
      } else {
        this.lat = this.defaultLocation.lat;
        this.lng = this.defaultLocation.lng;
      }
    });
  }

  getResponse(query, callback) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      callback(results, status);
    });
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

}
