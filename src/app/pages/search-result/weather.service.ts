import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const apiKey: string = environment.weatherAPIKey;

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(
    private http: HttpClient,
  ) { }

  getCurrentWeather(lat: number, lng: number) {
    return this.http.get(`${environment.weatherAPIUrl}/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`);
  }

  getWeatherForecast(lat: number, lng: number) {
    return this.http.get(`${environment.weatherAPIUrl}/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`);
  }

}
