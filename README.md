# W-AP

W-AP (**W**eather-M**ap**) is website that shows you the weather and a map based on address, city name (international), or zipcode (U.S. only).

## Design Process and Mockup

To design the website, MS Paint, SAI, and Canva were used.

### Paint/SAI

![Discord Image](https://cdn.discordapp.com/attachments/392200177064083478/643972091707916308/unknown.png)

![Discord Image](https://cdn.discordapp.com/attachments/392200177064083478/643972467328679936/unknown.png)

### Canva
[Canva Project](https://www.canva.com/design/DADqej7XEO4/1oL30sGh0ANPdc6gLApbtg/view)
>![Discord Image](https://media.discordapp.net/attachments/549718410829758464/641827925238218782/unknown.png)
![Discord Image](https://cdn.discordapp.com/attachments/549718410829758464/641829099484086281/unknown.png)
![Canva Animation](https://j.gifs.com/zvlz9Y.gif)


## Difficulties

### Weather API
>![Discord Image](https://cdn.discordapp.com/attachments/549718410829758464/642349968539254816/unknown.png)

With the 5 day forecast OpenWeatherAPI, the API gave the results in 3 hour intervals, represented by an array of 40 objects, each containing their own high, low, and average temperature.

To parse through the data, we went through each object and kept track of each `temp_min` and `temp_max`.
```js
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
```
### API Calling Issues

![Discord Image](https://media.discordapp.net/attachments/549718410829758464/643644600531157023/unknown.png?width=1443&height=248)

A user could press the search bar in quick succession and call the API multiple times while the page was still rendering, causing duplicate information to display.

We added a directive with RxJS that listened for click events and used `throttleTime` to emit only the first click within a given moment in time.

[W-AP/src/app/directives/](https://github.com/DJ9123/W-AP/tree/master/src/app/directives)


### API Leaks 😳

>![Discord Image](https://cdn.discordapp.com/attachments/392200177064083478/643981081741099018/unknown.png)

![Discord Image](https://cdn.discordapp.com/attachments/392200177064083478/643983867388100621/unknown.png)

It took two hours to notice but the API key was deactivated and removed. Whoopsieeee.


# Default Angular README below

# WAP

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Deploy

Run `ng deploy --base-href '/W-AP/'` to deploy the project.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
