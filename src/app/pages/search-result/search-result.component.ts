/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { DefaultMapStyle } from 'src/app/models/default-map-style';
import { MapsAPILoader } from '@agm/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { WeatherService } from './weather.service';
import * as moment from 'moment';

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
  @ViewChild('AgmMapWrapper', { static: false }) AgmMapWrapper;
  isReadySubject = new Subject();
  defaultLocation = { lat: 33.585639, lng: -101.873648 };
  zoom = 10;

  lat: number;
  lng: number;

  mapStyle: any[] = this.style.getStyle();
  // END MAPS

  // WEATHER
  loadedQuery: string;
  formattedDate: string;
  iconUrl: string;
  currentWeather: {
    current: number,
    originalCurrent: number,
    hi: number,
    originalHi: number,
    lo: number,
    originalLo: number,
    name: string
  };
  // END WEATHER

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private style: DefaultMapStyle,
    private loader: MapsAPILoader,
    private weatherService: WeatherService,
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

      this.getWeather();
    });
  }

  getResponse(query, callback) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      callback(results, status);
    });
  }

  getWeather() {
    this.loadedQuery = this.formGroup.value.query.slice(0);
    this.formattedDate = moment().format('dddd, MMM D');
    this.weatherService.getCurrentWeather(this.lat, this.lng)
      .subscribe((x: any) => {
        console.log(x);

        this.currentWeather = {
          current: x.main.temp.toFixed(1),
          originalCurrent: x.main.temp,
          hi: x.main.temp_max.toFixed(1),
          originalHi: x.main.temp_max,
          lo: x.main.temp_min.toFixed(1),
          originalLo: x.main.temp_min,
          name: x.name,
        };

        this.iconUrl = `https://openweathermap.org/img/wn/${x.weather[0].icon}@2x.png`;
      }, err => {
        console.error(err);
      });
  }

  optionChanged() {
    this.currentWeather.current = this.convertUnit(this.currentWeather.originalCurrent);
    this.currentWeather.hi = this.convertUnit(this.currentWeather.originalHi);
    this.currentWeather.lo = this.convertUnit(this.currentWeather.originalLo);
  }

  convertUnit(value: number): number {
    let result = value;
    switch (this.formGroup.value.option) {
      case 'F':
        break;
      case 'C':
        result = (value - 32) * (5 / 9);
        break;

      default:
        break;
    }
    return parseFloat(result.toFixed(1));
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

}
