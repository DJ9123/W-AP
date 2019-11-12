/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewEncapsulation, ViewChild, ApplicationRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { DefaultMapStyle } from 'src/app/models/default-map-style';
import { MapsAPILoader } from '@agm/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { WeatherService } from './weather.service';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DefaultMapStyle]
})
export class SearchResultComponent implements AfterViewInit {

  formGroup = new FormGroup({
    query: new FormControl(''),
    option: new FormControl(''),
  });

  // MAPS
  @ViewChild('AgmMapWrapper', { static: false }) AgmMapWrapper;
  isReadySubject = new Subject();
  defaultLocation = { lat: 33.585639, lng: -101.873648 }; //default location Lubbock
  zoom = 12.5;

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
  forecast: any[] = [];
  // END WEATHER

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private style: DefaultMapStyle,
    private loader: MapsAPILoader,
    private weatherService: WeatherService,
    private _snackBar: MatSnackBar,
    private appRef: ApplicationRef,
  ) { }

  ngAfterViewInit() {
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
        this.zoom = 12.5;
        const location = results[0].geometry.location;
        this.lat = location.lat();
        this.lng = location.lng();
      } else {
        // this.snackbar.open('Location not found');
        this._snackBar.open('Location not found', 'close', { duration: 2000 });
        this.lat = this.defaultLocation.lat;
        this.lng = this.defaultLocation.lng;
      }
      this.appRef.tick();

      this.forecast = [];
      this.getWeather();
      this.getWeatherForecast();
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
        this.currentWeather = {
          originalCurrent: x.main.temp,
          current: x.main.temp.toFixed(1),
          originalHi: x.main.temp_max,
          hi: x.main.temp_max.toFixed(1),
          originalLo: x.main.temp_min,
          lo: x.main.temp_min.toFixed(1),
          name: x.name,
        };

        this.iconUrl = `https://openweathermap.org/img/wn/${x.weather[0].icon}@2x.png`;
        
        this.optionChanged();
      }, err => {
        console.error(err);
      });
  }

  getWeatherForecast() {
    this.loadedQuery = this.formGroup.value.query.slice(0);
    this.formattedDate = moment().format('dddd, MMM D');
    this.weatherService.getWeatherForecast(this.lat, this.lng)
      .subscribe((x: any) => {
        let day: any = {};
        let tempTotal = 0;

        for (let d = 0; d < x.list.length - 8; d += 8) {
          day = Object.assign({}, x.list[d]);
          tempTotal = 0;

          // tslint:disable-next-line: prefer-for-of
          for (let h = d; h < 5 + d; h++) {
            const element = x.list[h];

            tempTotal += Object.assign({}, element.main).temp;

            if (day.main.temp_min > element.main.temp_min) {
              day.main.temp_min = element.main.temp_min;
            }
            if (day.main.temp_max < element.main.temp_max) {
              day.main.temp_max = element.main.temp_max;
            }

          }
          day.main.tempAvg = tempTotal / 5;

          day.main.original_temp = day.main.tempAvg;
          day.main.temp = day.main.tempAvg.toFixed(1);
          day.main.original_temp_min = day.main.temp_min;
          day.main.temp_min = day.main.temp_min.toFixed(1);
          day.main.original_temp_max = day.main.temp_max;
          day.main.temp_max = day.main.temp_max.toFixed(1);

          day.iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

          tempTotal = 0;
          this.forecast.push(day);
          day = {};
        }

        this.optionChanged();
      }, err => {
        console.error(err);
      });
  }

  optionChanged() {
    this.currentWeather.current = this.convertUnit(this.currentWeather.originalCurrent);
    this.currentWeather.hi = this.convertUnit(this.currentWeather.originalHi);
    this.currentWeather.lo = this.convertUnit(this.currentWeather.originalLo);
    this.appRef.tick();
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

  getFormattedDate(date: string): string {
    return moment(new Date(date)).format('dddd, MMM D');
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

}
