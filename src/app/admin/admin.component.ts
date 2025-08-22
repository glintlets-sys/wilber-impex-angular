import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminCategoriesComponent } from './admin-categories/admin-categories.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminCustomersComponent } from './admin-customers/admin-customers.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AdminStockConsignmentComponent } from './admin-stock-consignment/admin-stock-consignment.component';
import { AdminBlogsComponent } from './admin-blogs/admin-blogs.component';
import { AdminRecommendationsComponent } from './admin-recommendations/admin-recommendations.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    HeaderComponent,
    AdminDashboardComponent,
    AdminProductsComponent,
    AdminCategoriesComponent,
    AdminOrdersComponent,
    AdminCustomersComponent,
    AdminSettingsComponent,
    AdminStockConsignmentComponent,
    AdminBlogsComponent,
    AdminRecommendationsComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  activeView = 'dashboard';

  // Object to keep track of which sections are open
  public sections = {
    dashboard: true,
    products: true,
    orders: true,
    customers: true,
    content: true,
    settings: true,
    stock: true
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check for query parameters to set the active view
    this.route.queryParams.subscribe(params => {
      const section = params['section'];
      if (section) {
        console.log('🔍 [Admin] Query parameter section:', section);
        this.navigateToSection(section);
      }
    });
  }

  // Function to toggle sections
  public toggleSection(section: string): void {
    console.log('🔄 [Admin] Toggling section:', section, 'Current state:', this.sections[section]);
    this.sections[section] = !this.sections[section];
    console.log('🔄 [Admin] New state:', this.sections[section]);
  }

  // Reset all views
  reset() {
    this.activeView = '';
  }

  // View toggles
  showDashboard() {
    this.reset();
    this.activeView = 'dashboard';
  }

  showProducts() {
    this.reset();
    this.activeView = 'products';
  }

  showCategories() {
    this.reset();
    this.activeView = 'categories';
  }

  showOrders() {
    this.reset();
    this.activeView = 'orders';
  }

  showCustomers() {
    this.reset();
    this.activeView = 'customers';
  }

  showSettings() {
    this.reset();
    this.activeView = 'settings';
  }

  showBlogs() {
    this.reset();
    this.activeView = 'blogs';
  }

  showRecommendations() {
    this.reset();
    this.activeView = 'recommendations';
  }

  addBlog() {
    // TODO: Implement add blog functionality
    console.log('🔄 [Admin] Add blog clicked');
  }

  showStockConsignment() {
    console.log('🔄 [Admin] Showing stock consignment view');
    this.reset();
    this.activeView = 'stock-consignment';
    console.log('🔄 [Admin] Active view set to:', this.activeView);
  }

  // Navigate to section based on parameter
  private navigateToSection(section: string): void {
    console.log('🔄 [Admin] Navigating to section:', section);
    switch (section.toLowerCase()) {
      case 'dashboard':
        this.showDashboard();
        break;
      case 'products':
        this.showProducts();
        break;
      case 'categories':
        this.showCategories();
        break;
      case 'orders':
        this.showOrders();
        break;
      case 'customers':
        this.showCustomers();
        break;
      case 'settings':
        this.showSettings();
        break;
      case 'blogs':
        this.showBlogs();
        break;
      case 'recommendations':
        this.showRecommendations();
        break;
      case 'stock-consignment':
      case 'stockconsignment':
      case 'stock':
        this.showStockConsignment();
        break;
      default:
        console.warn('⚠️ [Admin] Unknown section:', section);
        this.showDashboard();
        break;
    }
  }
}
