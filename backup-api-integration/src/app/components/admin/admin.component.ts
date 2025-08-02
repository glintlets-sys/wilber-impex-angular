import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent   {
   constructor(private router: Router) {
    
  }
  
  

  public page6: any;
  public focus: any;
  public focus14: any;

 // Object to keep track of which sections are open
 public sections = {
  dashboard: true, // Open by default
  customerDetails: true,
  transactions: true,
  myCustomers: true,
  contentManagement: true,
  communication: true,
  landingPage: true,
  promotions: true
};

// Function to toggle sections
public toggleSection(section: string): void {
  this.sections[section] = !this.sections[section];
}


  reset()
  {
    this.toggleDashboardView = false;
    this.togglePicturesView = false;
    this.toggleStockConsignmentsView = false;
    this.toggleStocksView = false;
    this.toggleToysView = false;
    this.toggleUserTableView = false;
    this.toggleOrdersTableView = false;
    this.toggleCategoryTableView = false;
    this.toggleFeaturedTableView = false;
  }

  public toggleToysView = false;
  public toggleToys()
  {
    this.reset();
    this.toggleToysView = !this.toggleToysView;
  }

  public toggleDashboardView = true;
  public toggleDashbard()
  {
    this.reset();
    this.toggleDashboardView = !this.toggleDashboardView;
  }

  public togglePicturesView = false;
  public togglePictures()
  {
    this.reset();
    this.togglePicturesView = !this.togglePicturesView;
  }

  public toggleStockConsignmentsView = false;
  public toggleStockConsignments()
  {
    this.reset();
    this.toggleStockConsignmentsView = !this.toggleStockConsignmentsView;
  }


  public toggleStocksView = false;
  public toggleStocks()
  {
    this.reset();
    this.toggleStocksView = !this.toggleStocksView;
  }


  public toggleUserTableView = false;
  public toggleUserTable()
  {
    this.reset();
    this.toggleUserTableView = !this.toggleUserTableView;
  }

  public toggleOrdersTableView = false;
  public toggleOrdersView()
  {
    this.reset();
    this.toggleOrdersTableView = !this.toggleOrdersTableView;
  }

  public toggleCategoryTableView = false;
  public toggleCategoryView()
  {
    this.reset();
    this.toggleCategoryTableView = !this.toggleCategoryTableView;
  }

  public toggleFeaturedTableView = false;
  public toggleFeaturedView()
  {
    this.reset();
    this.toggleFeaturedTableView = !this.toggleFeaturedTableView;
  }
  public  toggleStocked(){
    this.router.navigate(['/profile']);
  }
}
