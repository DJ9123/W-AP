import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  formGroup = new FormGroup({
    query: new FormControl(''),
    option: new FormControl('F'),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const qParams = this.route.snapshot.queryParams;

    if (qParams.query && qParams.option) {
      this.router.navigate(['/search'], { queryParams: qParams });
    } else {
      if (qParams.query) {
        this.formGroup.get('query').setValue(qParams.query);
      }
      if (qParams.option) {
        this.formGroup.get('option').setValue(qParams.option);
      }
    }
  }

  search() {
    this.router.navigate(['/search'], { queryParams: this.formGroup.value} );
  }

}
