import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { AgmCoreModule } from '@agm/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http'; 
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { SearchComponent } from './pages/search/search.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { WeatherService } from './pages/search-result/weather.service';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchResultComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDHdQ62hIPDsqJHghXfWt-0yvgSG7yDtLg'
    }),
    FlexLayoutModule,
    HttpClientModule,
    MatSnackBarModule,
  ],
  providers: [
    WeatherService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
