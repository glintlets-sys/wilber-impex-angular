import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';

// Import services
import { ToyService } from '../../shared-services/toy.service';
import { UserService } from '../../shared-services/user.service';
import { OrderService } from '../../shared-services/order.service';
import { ProductService } from '../../services/product.service';

// Import interfaces
import { Toy } from '../../shared-services/toy';
import { User } from '../../shared-services/user';
import { OrderDTO } from '../../shared-services/order';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  // Loading state
  isLoading = true;
  
  // Subscriptions
  private subscriptions: Subscription[] = [];
  
  // Real data from services
  stats = {
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalRevenue: 0,
    activeProducts: 0,
    pendingOrders: 0,
    completedOrders: 0
  };

  recentOrders: any[] = [];
  products: Toy[] = [];
  customers: User[] = [];
  orders: OrderDTO[] = [];
  categories: any[] = [];

  constructor(
    private toyService: ToyService,
    private userService: UserService,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('🚀 [AdminDashboard] Initializing dashboard with real data...');
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadDashboardData(): void {
    this.isLoading = true;
    console.log('📊 [AdminDashboard] Loading data from all services...');

    // Add timeout to prevent infinite loading
    setTimeout(() => {
      if (this.isLoading) {
        console.warn('⚠️ [AdminDashboard] Loading timeout reached, forcing completion');
        this.isLoading = false;
        this.calculateStats();
        this.prepareRecentOrders();
      }
    }, 10000); // 10 second timeout

    // Load data individually to identify which service is causing issues
    this.loadProducts();
    this.loadCustomers();
    this.loadOrders();
    this.loadCategories();
  }

  private loadProducts(): void {
    console.log('🛍️ [AdminDashboard] Loading products...');
    this.toyService.getAllToysNonPaginated().subscribe({
      next: (products) => {
        console.log('✅ [AdminDashboard] Products loaded:', products);
        this.products = products || [];
        this.checkAllDataLoaded();
      },
      error: (error) => {
        console.error('❌ [AdminDashboard] Error loading products:', error);
        this.products = [];
        this.checkAllDataLoaded();
      }
    });
  }

  private loadCustomers(): void {
    console.log('👥 [AdminDashboard] Loading customers...');
    this.userService.getUsers().subscribe({
      next: (customers) => {
        console.log('✅ [AdminDashboard] Customers loaded:', customers);
        this.customers = customers || [];
        this.checkAllDataLoaded();
      },
      error: (error) => {
        console.error('❌ [AdminDashboard] Error loading customers:', error);
        this.customers = [];
        this.checkAllDataLoaded();
      }
    });
  }

  private loadOrders(): void {
    console.log('📦 [AdminDashboard] Loading orders...');
    this.orderService.getAdminOrders(0, 100).subscribe({
      next: (response) => {
        console.log('✅ [AdminDashboard] Orders loaded:', response);
        this.orders = response?.body || [];
        this.checkAllDataLoaded();
      },
      error: (error) => {
        console.error('❌ [AdminDashboard] Error loading orders:', error);
        this.orders = [];
        this.checkAllDataLoaded();
      }
    });
  }

  private loadCategories(): void {
    console.log('🏷️ [AdminDashboard] Loading categories...');
    this.productService.getCategories().subscribe({
      next: (categories) => {
        console.log('✅ [AdminDashboard] Categories loaded:', categories);
        this.categories = categories || [];
        this.checkAllDataLoaded();
      },
      error: (error) => {
        console.error('❌ [AdminDashboard] Error loading categories:', error);
        this.categories = [];
        this.checkAllDataLoaded();
      }
    });
  }

  private checkAllDataLoaded(): void {
    // Check if all data has been attempted to load (success or error)
    const dataLoadAttempts = [
      this.products !== undefined,
      this.customers !== undefined,
      this.orders !== undefined,
      this.categories !== undefined
    ];

    if (dataLoadAttempts.every(attempted => attempted)) {
      console.log('📊 [AdminDashboard] All data load attempts completed');
      this.calculateStats();
      this.prepareRecentOrders();
      this.isLoading = false;
      console.log('📈 [AdminDashboard] Dashboard stats calculated:', this.stats);
    }
  }

  calculateStats(): void {
    console.log('🧮 [AdminDashboard] Calculating stats...');
    
    // Basic counts
    this.stats.totalProducts = this.products.length;
    this.stats.totalCustomers = this.customers.length;
    this.stats.totalOrders = this.orders.length;
    this.stats.totalCategories = this.categories.length;

    // Active products (not unavailable)
    this.stats.activeProducts = this.products.filter(p => !p.notAvailable).length;

    // Order analysis
    this.calculateOrderStats();
    
    // Revenue calculation
    this.calculateRevenue();

    console.log('✅ [AdminDashboard] Stats calculated:', {
      totalProducts: this.stats.totalProducts,
      activeProducts: this.stats.activeProducts,
      totalCustomers: this.stats.totalCustomers,
      totalOrders: this.stats.totalOrders,
      totalRevenue: this.stats.totalRevenue
    });
  }

  calculateOrderStats(): void {
    // Reset order stats
    this.stats.pendingOrders = 0;
    this.stats.completedOrders = 0;

    this.orders.forEach(order => {
      // Check order status - this might need adjustment based on your order status structure
      const orderStatus = this.getOrderStatus(order);
      
      if (orderStatus.toLowerCase().includes('complete') || orderStatus.toLowerCase().includes('deliver')) {
        this.stats.completedOrders++;
      } else if (orderStatus.toLowerCase().includes('pending') || orderStatus.toLowerCase().includes('process')) {
        this.stats.pendingOrders++;
      }
    });
  }

  calculateRevenue(): void {
    this.stats.totalRevenue = 0;

    this.orders.forEach(order => {
      try {
        const summary = this.getPurchaseSummary(order);
        const amount = summary.billSummary?.totalPrice || summary.totalAmount || 0;
        this.stats.totalRevenue += Number(amount) || 0;
      } catch (error) {
        console.warn('⚠️ [AdminDashboard] Error calculating revenue for order:', order.id, error);
      }
    });

    console.log('💰 [AdminDashboard] Total revenue calculated:', this.stats.totalRevenue);
  }

  prepareRecentOrders(): void {
    // Get the 5 most recent orders
    const sortedOrders = [...this.orders]
      .sort((a, b) => {
        const dateA = new Date(a.creationDate || 0).getTime();
        const dateB = new Date(b.creationDate || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);

    // Store the actual OrderDTO objects for accurate status display
    this.recentOrders = sortedOrders;

    console.log('📋 [AdminDashboard] Recent orders prepared:', this.recentOrders);
  }

  // Helper methods (similar to what we have in admin-orders component)
  getPurchaseSummary(order: OrderDTO): any {
    try {
      if (typeof order.purchaseSummary === 'string') {
        return JSON.parse(order.purchaseSummary);
      }
      return order.purchaseSummary || {};
    } catch (error) {
      console.warn('⚠️ [AdminDashboard] Error parsing purchase summary:', error);
      return {};
    }
  }

  getCustomerName(order: OrderDTO): string {
    const summary = this.getPurchaseSummary(order);
    return summary.deliveryDetails?.customerName || 
           summary.customerName || 
           order.username ||
           `Customer #${order.userId}`;
  }

  getTotalAmount(order: OrderDTO): number {
    try {
      const summary = this.getPurchaseSummary(order);
      return summary.billSummary?.totalPrice || summary.totalAmount || 0;
    } catch (error) {
      console.warn('⚠️ [AdminDashboard] Error getting total amount for order:', order.id, error);
      return 0;
    }
  }

  getOrderStatus(order: OrderDTO): string {
    // Use the same logic as admin-orders component for accurate dispatch status
    if (!order.dispatchSummary) {
      // No dispatch summary - check payment status
      const paymentStatus = this.getPaymentStatus(order);
      if (paymentStatus === 'Payment Success') {
        return 'Confirmed';
      }
      if (paymentStatus === 'Payment Failed') {
        return 'Failed';
      }
      return 'Pending';
    }
    
    // Has dispatch summary - show shipment status
    const status = order.dispatchSummary.shipmentStatus;
    
    switch (status) {
      case 'READYTODISPATCH': 
        return 'Ready to Dispatch';
      case 'DISPATCHED': 
        return 'Dispatched';
      case 'DELIVERED': 
        return 'Delivered';
      default: 
        return status || 'Pending';
    }
  }

  getPaymentStatus(order: OrderDTO): string {
    const status = order.paymentStatus;
    const statusValue = status?.toString();
    
    if (statusValue === "PAYMENTSUCCESS" || statusValue === "2") {
      return "Payment Success";
    }
    if (statusValue === "PAYMENTINITIATED" || statusValue === "0") {
      return "Payment Initiated";
    }
    if (statusValue === "PAYMENTFAILED" || statusValue === "1") {
      return "Payment Failed";
    }
    return "Unknown";
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('complete') || statusLower.includes('deliver') || statusLower.includes('success')) {
      return 'badge bg-success';
    }
    if (statusLower.includes('process') || statusLower.includes('pending')) {
      return 'badge bg-warning';
    }
    if (statusLower.includes('ship')) {
      return 'badge bg-info';
    }
    if (statusLower.includes('cancel') || statusLower.includes('fail')) {
      return 'badge bg-danger';
    }
    return 'badge bg-secondary';
  }

  getOrderStatusClass(order: OrderDTO): string {
    // Use the same logic as admin-orders component for accurate status classes
    if (!order.dispatchSummary) {
      // No dispatch summary - use payment status
      const paymentStatus = this.getPaymentStatus(order);
      if (paymentStatus === 'Payment Success') {
        return 'badge bg-success';
      }
      if (paymentStatus === 'Payment Failed') {
        return 'badge bg-danger';
      }
      return 'badge bg-warning';
    }
    
    // Has dispatch summary - use shipment status
    const status = order.dispatchSummary.shipmentStatus;
    
    switch (status) {
      case 'READYTODISPATCH': 
        return 'badge bg-warning';
      case 'DISPATCHED': 
        return 'badge bg-info';
      case 'DELIVERED': 
        return 'badge bg-success';
      default: 
        return 'badge bg-secondary';
    }
  }

  // Currency formatting
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  // Refresh dashboard data
  refreshDashboard(): void {
    console.log('🔄 [AdminDashboard] Refreshing dashboard data...');
    this.loadDashboardData();
  }

  // Additional stats methods for footer
  getTodayOrdersCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.orders.filter(order => {
      if (!order.creationDate) return false;
      const orderDate = new Date(order.creationDate);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length;
  }

  getWeekOrdersCount(): number {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.orders.filter(order => {
      if (!order.creationDate) return false;
      const orderDate = new Date(order.creationDate);
      return orderDate >= weekAgo;
    }).length;
  }

  getMonthOrdersCount(): number {
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    return this.orders.filter(order => {
      if (!order.creationDate) return false;
      const orderDate = new Date(order.creationDate);
      return orderDate >= monthAgo;
    }).length;
  }

  getSuccessRate(): number {
    if (this.stats.totalOrders === 0) return 0;
    return Math.round((this.stats.completedOrders / this.stats.totalOrders) * 100);
  }

  // Helper methods for payment status in recent orders table
  getPaymentStatusForOrder(orderId: number): string {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return 'Unknown';
    return this.getPaymentStatus(order);
  }

  getPaymentStatusClass(orderId: number): string {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return 'badge bg-secondary';
    
    const paymentStatus = this.getPaymentStatus(order);
    return this.getStatusClass(paymentStatus);
  }

  // Navigation methods for dashboard tiles
  navigateToProducts(): void {
    console.log('🛍️ [AdminDashboard] Navigating to Products page');
    this.router.navigate(['/admin'], { queryParams: { section: 'products' } });
  }

  navigateToCustomers(): void {
    console.log('👥 [AdminDashboard] Navigating to Customers page');
    this.router.navigate(['/admin'], { queryParams: { section: 'customers' } });
  }

  navigateToOrders(): void {
    console.log('📦 [AdminDashboard] Navigating to Orders page');
    this.router.navigate(['/admin'], { queryParams: { section: 'orders' } });
  }

  navigateToCategories(): void {
    console.log('🏷️ [AdminDashboard] Navigating to Categories page');
    this.router.navigate(['/admin'], { queryParams: { section: 'categories' } });
  }
}
