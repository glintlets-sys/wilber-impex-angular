import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-purchase-response',
  templateUrl: 'purchase-response.component.html',
  styleUrls: ['purchase-response.component.scss']
})
export class PurchaseResponseComponent implements OnInit {
  isSuccess: boolean;
  encryptedResponse: string;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Get the success/failure status from the route query parameter
    this.route.queryParams.subscribe(params => {
      this.isSuccess = params.success === 'true';
    });

    this.route.queryParams.subscribe(params => {
      this.encryptedResponse = params.encryptedResponse;
    });

  }

  navigateToHomePage() {
    this.router.navigate(['/']);
  }
}
