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
  // private geocoder = new google.maps.Geocoder();

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
      this.search();
    } else /* if (this.defaultLocation) */ {
      this.lat = this.defaultLocation.lat;
      this.lng = this.defaultLocation.lng;
    } /* else {
      this.loader.load().then(() => {
        this.setCurrentLocation();
      });
    } */
  }

  // setCurrentLocation() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.lat = position.coords.latitude;
  //       this.lng = position.coords.longitude;
  //       this.defaultLocation = { lat: this.lat, lng: this.lng };
  //     });
  //   }
  // }

  search() {
    this.getCoords(this.formGroup.value.query, (coordinates) => {
      console.log(coordinates);
    });
  }

  getCoords(query, callback) {
    let coordinates;
    // this.geocoder.geocode({ address: query }, (results, status) => {
    //   coordinates = results[0].geometry.location;
    //   callback(coordinates);
    // });
  }

}
