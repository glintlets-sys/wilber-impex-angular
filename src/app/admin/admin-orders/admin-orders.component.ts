import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OrderService } from '../../shared-services/order.service';
import { OrderDTO, PaymentStatus, OrderedItem } from '../../shared-services/order';
import { AuthenticationService } from '../../shared-services/authentication.service';
import { ToasterService } from '../../shared-services/toaster.service';
import { ToastType } from '../../shared-services/toaster';
import { HttpResponse } from '@angular/common/http';
import { DispatchService } from '../../shared-services/dispatch.service';
import { DispatchSummary, SHIPMENTSTATUS } from '../../shared-services/dispatchSummary';
import { ShiprocketService } from '../../shared-services/shiprocket/shiprocket.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  orders: OrderDTO[] = [];
  filteredOrders: OrderDTO[] = [];
  private subscriptions: Subscription[] = [];
  
  // Pagination
  currentPage = 0;
  requestedCount = 10;
  totalCount: number = 0;
  numberOfResults: number = 0;
  totalPages = 0;
  
  // Loading states
  isLoading = false;
  
  // Filtering
  searchTerm: string = '';
  selectedPaymentStatus: string = '';
  selectedShipmentStatus: string = '';
  dateFrom: string = '';
  dateTo: string = '';
  
  // Shipment status options
  shipmentStatusOptions: SHIPMENTSTATUS[] = Object.values(SHIPMENTSTATUS);
  
  // ShipRocket tracking data
  shipRocketTrackingData: { [key: string]: any } = {};
  isShipRocketIntegration: boolean = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthenticationService,
    private toasterService: ToasterService,
    private dispatchService: DispatchService,
    private shipRocketService: ShiprocketService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    
    // Add click outside handler to close dropdowns
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    // Remove click outside handler
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  loadOrders(): void {
    this.isLoading = true;
    
    const ordersSub = this.orderService.getAdminOrders(this.currentPage, this.requestedCount).subscribe({
      next: (response: HttpResponse<OrderDTO[]>) => {
        console.log('📦 [AdminOrders] Loaded orders:', response.body);
        this.orders = response.body || [];
        
        // Debug payment status for each order
        this.orders.forEach((order, index) => {
          console.log(`🔍 [AdminOrders] Order ${index + 1} - ID: ${order.id}, Payment Status:`, order.paymentStatus, 'Type:', typeof order.paymentStatus);
          console.log(`🔍 [AdminOrders] Order ${index + 1} - dispatchSummary:`, order.dispatchSummary);
          console.log(`🔍 [AdminOrders] Order ${index + 1} - Full order object:`, order);
        });
        
        // Parse pagination headers
        const totalCountHeader = response.headers.get('Total-Count');
        const totalPagesHeader = response.headers.get('Total-Pages');
        this.numberOfResults = totalCountHeader ? +totalCountHeader : 0;
        this.totalPages = totalPagesHeader ? +totalPagesHeader : 0;
        
        console.log('📊 [AdminOrders] Pagination:', {
          totalCount: this.numberOfResults,
          totalPages: this.totalPages,
          currentPage: this.currentPage
        });
        
        // Apply filters to loaded orders
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [AdminOrders] Error loading orders:', error);
        this.toasterService.showToast('Error loading orders', ToastType.Error, 3000);
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(ordersSub);
  }

  // Parse purchase summary JSON
  getPurchaseSummary(order: OrderDTO): any {
    try {
      const summary = JSON.parse(order.purchaseSummary);
      console.log('📋 [AdminOrders] Purchase Summary for order', order.id, ':', summary);
      return summary;
    } catch (error) {
      console.error('Error parsing purchase summary:', error);
      return {};
    }
  }

  // Get order items from purchase summary
  getOrderItems(order: OrderDTO): any[] {
    const summary = this.getPurchaseSummary(order);
    const items = summary.cartSummary?.items || summary.items || [];
    console.log('📦 [AdminOrders] Order items for order', order.id, ':', items);
    return items;
  }

  // Get order address from purchase summary
  getOrderAddress(order: OrderDTO): any {
    const summary = this.getPurchaseSummary(order);
    return summary.address || {};
  }

  // Get total amount from purchase summary
  getTotalAmount(order: OrderDTO): number {
    const summary = this.getPurchaseSummary(order);
    return summary.billSummary?.totalPrice || summary.totalAmount || 0;
  }

  getFormattedAddress(order: OrderDTO): string {
    const address = this.getOrderAddress(order);
    if (!address || !address.firstLine) return 'No address available';
    
    return `${address.firstLine} ${address.secondLine || ''}\n${address.city}, ${address.state} ${address.country || ''} - ${address.pincode}\nEmail: ${address.emailAddress || 'N/A'}\nPhone: ${address.mobileNumber || 'N/A'}`;
  }

  toggleOrderDetails(order: OrderDTO): void {
    order.showDetails = !order.showDetails;
  }

  toggleShipmentDetails(order: OrderDTO): void {
    order.showShipmentDetails = !order.showShipmentDetails;
  }

  getPaymentStatus(status: any): string {
    console.log('💳 [AdminOrders] Payment status received:', status, 'Type:', typeof status);
    
    // Handle string values from backend (primary) and enum values (fallback)
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
    
    console.warn('⚠️ [AdminOrders] Unknown payment status:', status);
    return `Unknown (${status})`;
  }

  getPaymentStatusClass(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.PAYMENTSUCCESS: return 'text-success';
      case PaymentStatus.PAYMENTFAILED: return 'text-danger';
      case PaymentStatus.PAYMENTINITIATED: return 'text-warning';
      default: return 'text-muted';
    }
  }

  getShipmentStatus(order: OrderDTO): string {
    console.log('🔍 [AdminOrders] getShipmentStatus called for order:', order.id);
    console.log('🔍 [AdminOrders] dispatchSummary:', order.dispatchSummary);
    
    if (!order.dispatchSummary) {
      console.log('🔍 [AdminOrders] No dispatchSummary, returning "Not Dispatched"');
      return 'Not Dispatched';
    }
    
    const status = order.dispatchSummary.shipmentStatus;
    console.log('🔍 [AdminOrders] Raw shipment status:', status);
    
    switch (status) {
      case 'READYTODISPATCH': 
        console.log('🔍 [AdminOrders] Returning "Ready to Dispatch"');
        return 'Ready to Dispatch';
      case 'DISPATCHED': 
        console.log('🔍 [AdminOrders] Returning "Dispatched"');
        return 'Dispatched';
      case 'DELIVERED': 
        console.log('🔍 [AdminOrders] Returning "Delivered"');
        return 'Delivered';
      default: 
        console.log('🔍 [AdminOrders] Default case, returning:', status || 'Pending');
        return status || 'Pending';
    }
  }

  getShipmentStatusClass(order: OrderDTO): string {
    if (!order.dispatchSummary) return 'text-warning';
    
    const status = order.dispatchSummary.shipmentStatus;
    switch (status) {
      case 'READYTODISPATCH': return 'text-info';
      case 'DISPATCHED': return 'text-primary';
      case 'DELIVERED': return 'text-success';
      default: return 'text-warning';
    }
  }

  hasSentToShippingProvider(order: OrderDTO): boolean {
    // Return true if order has NOT been sent to shipping provider (no shipment ID)
    // Following backup application logic: only check if shipmentId exists
    return !(order.dispatchSummary?.shipmentId);
  }

  navigateToInvoice(order: OrderDTO): void {
    console.log('Navigate to invoice for order:', order.id);
    // Implementation for invoice navigation
  }

    sendToShippingProvider(order: OrderDTO): void {
    console.log('🚚 [AdminOrders] Sending order to shipping provider:', order.id);
    
    // Check if configuration is ready before proceeding
    if (!this.dispatchService.isConfigurationReady()) {
      console.warn('⚠️ [AdminOrders] Configuration not ready. Status:', this.dispatchService.getConfigurationStatus());
      this.toasterService.showToast(
        'Shipping configuration is not ready. Please wait a moment and try again.', 
        ToastType.Warn, 
        3000
      );
      return;
    }
    
    // Show loading state
    this.isLoading = true;
    
    const dispatchSub = this.dispatchService.sendToShippingProvider(order).subscribe({
      next: (dispatchSummary: DispatchSummary) => {
        console.log('✅ [AdminOrders] Order sent to shipping provider successfully:', dispatchSummary);
        
        // Update the order with the new dispatch summary
        order.dispatchSummary = dispatchSummary;
        
        // Show success message
        this.toasterService.showToast(
          `Order has been sent to shipping service. Shipping ID: ${dispatchSummary.shipmentId}`, 
          ToastType.Success, 
          5000
        );
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [AdminOrders] Error sending order to shipping provider:', error);
        
        // Show specific error message based on error type
        let errorMessage = 'Error sending order to shipping provider. Please try again.';
        
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.status === 0) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error?.status === 401) {
          errorMessage = 'Authentication error. Please login again.';
        } else if (error?.status === 403) {
          errorMessage = 'Access denied. You do not have permission to perform this action.';
        } else if (error?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        this.toasterService.showToast(errorMessage, ToastType.Error, 5000);
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(dispatchSub);
  }

  loadPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  loadNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadOrders();
    }
  }

  refreshOrders(): void {
    this.currentPage = 0;
    this.loadOrders();
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }

  formatTime(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString();
  }

  // New filtering and UI methods
  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = this.searchTerm === '' || 
        order.id.toString().includes(this.searchTerm) ||
        this.getCustomerName(order).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getCustomerEmail(order).toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesPayment = this.selectedPaymentStatus === '' || 
        order.paymentStatus?.toString() === this.selectedPaymentStatus;

      const matchesShipment = this.selectedShipmentStatus === '' || 
        this.getShipmentStatusRaw(order) === this.selectedShipmentStatus;

      const matchesDateFrom = this.dateFrom === '' || 
        new Date(order.creationDate!) >= new Date(this.dateFrom);

      const matchesDateTo = this.dateTo === '' || 
        new Date(order.creationDate!) <= new Date(this.dateTo);

      return matchesSearch && matchesPayment && matchesShipment && matchesDateFrom && matchesDateTo;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedPaymentStatus = '';
    this.selectedShipmentStatus = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.applyFilters();
  }

  getCustomerName(order: OrderDTO): string {
    const address = this.getOrderAddress(order);
    return address.customerName || order.username || 'Unknown Customer';
  }

  getCustomerEmail(order: OrderDTO): string {
    const address = this.getOrderAddress(order);
    return address.emailAddress || '';
  }

  getCustomerPhone(order: OrderDTO): string {
    const address = this.getOrderAddress(order);
    return address.mobileNumber || '';
  }

  getOrderItemsCount(order: OrderDTO): number {
    const items = this.getOrderItems(order);
    return items.length;
  }

  getShipmentStatusRaw(order: OrderDTO): string {
    return order.dispatchSummary?.shipmentStatus || 'PENDING';
  }

  getPaymentStatusBadgeClass(status: any): string {
    // Handle string values from backend (primary) and enum values (fallback)
    const statusValue = status?.toString();
    
    if (statusValue === "PAYMENTSUCCESS" || statusValue === "2") {
      return 'bg-success';
    }
    if (statusValue === "PAYMENTFAILED" || statusValue === "1") {
      return 'bg-danger';
    }
    if (statusValue === "PAYMENTINITIATED" || statusValue === "0") {
      return 'bg-warning text-dark';
    }
    
    return 'bg-secondary';
  }

  getShipmentStatusBadgeClass(order: OrderDTO): string {
    if (!order.dispatchSummary) return 'bg-warning text-dark';
    
    const status = order.dispatchSummary.shipmentStatus;
    switch (status) {
      case 'READYTODISPATCH': return 'bg-info text-dark';
      case 'DISPATCHED': return 'bg-primary';
      case 'DELIVERED': return 'bg-success';
      default: return 'bg-warning text-dark';
    }
  }

  getOrderAudits(order: OrderDTO): any[] {
    const summary = this.getPurchaseSummary(order);
    return summary.audits || [];
  }

  getOrderCountByStatus(status: string): number {
    return this.orders.filter(order => order.paymentStatus?.toString() === status).length;
  }

  getShippedOrdersCount(): number {
    return this.orders.filter(order => 
      order.dispatchSummary && 
      (order.dispatchSummary.shipmentStatus === 'DISPATCHED' || order.dispatchSummary.shipmentStatus === 'DELIVERED')
    ).length;
  }

  exportOrders(): void {
    console.log('Export orders functionality');
    this.toasterService.showToast('Export functionality coming soon', ToastType.Info, 3000);
  }

  // Shipment status update methods
  updateShipmentStatus(order: OrderDTO, newStatus: SHIPMENTSTATUS): void {
    console.log('🔄 [AdminOrders] Updating shipment status for order:', order.id, 'to:', newStatus);
    
    if (!order.dispatchSummary) {
      this.toasterService.showToast('No dispatch summary found for this order', ToastType.Error, 3000);
      return;
    }

    // Close the dropdown immediately
    order.showStatusDropdown = false;

    // Show loading state
    this.isLoading = true;
    
    // Update the local dispatch summary
    const updatedDispatchSummary: DispatchSummary = {
      ...order.dispatchSummary,
      shipmentStatus: newStatus
    };

    // Call the service to update the dispatch summary
    const updateSub = this.dispatchService.updateDispatchSummary(updatedDispatchSummary).subscribe({
      next: (response: DispatchSummary) => {
        console.log('✅ [AdminOrders] Shipment status updated successfully:', response);
        
        // Update the order's dispatch summary
        order.dispatchSummary = response;
        
        // Show success message
        this.toasterService.showToast(
          `Shipment status updated to ${this.getStatusDisplayName(newStatus)}`, 
          ToastType.Success, 
          3000
        );
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [AdminOrders] Error updating shipment status:', error);
        this.toasterService.showToast(
          'Error updating shipment status. Please try again.', 
          ToastType.Error, 
          3000
        );
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(updateSub);
  }

  getStatusDisplayName(status: SHIPMENTSTATUS): string {
    switch (status) {
      case SHIPMENTSTATUS.READYTODISPATCH: return 'Ready to Dispatch';
      case SHIPMENTSTATUS.DISPATCHED: return 'Dispatched';
      case SHIPMENTSTATUS.DELIVERED: return 'Delivered';
      default: return status;
    }
  }

  getStatusIconClass(status: SHIPMENTSTATUS): string {
    switch (status) {
      case SHIPMENTSTATUS.READYTODISPATCH: return 'text-info';
      case SHIPMENTSTATUS.DISPATCHED: return 'text-primary';
      case SHIPMENTSTATUS.DELIVERED: return 'text-success';
      default: return 'text-warning';
    }
  }

  // Dropdown management methods
  toggleStatusDropdown(order: OrderDTO): void {
    // Close all other dropdowns first
    this.orders.forEach(o => {
      if (o !== order) {
        o.showStatusDropdown = false;
      }
    });
    
    // Toggle the clicked dropdown
    order.showStatusDropdown = !order.showStatusDropdown;
  }

  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Check if click is outside dropdown
    if (!target.closest('.dropdown-menu') && !target.closest('.dropdown-toggle')) {
      this.orders.forEach(order => {
        order.showStatusDropdown = false;
      });
    }
  }

  // ShipRocket tracking methods
  loadShipRocketTrackingData(order: OrderDTO): void {
    if (!order.dispatchSummary?.shipmentId) {
      return;
    }

    const shipmentId = order.dispatchSummary.shipmentId;
    
    // Check if we already have tracking data for this shipment
    if (this.shipRocketTrackingData[shipmentId]) {
      return;
    }

    console.log('🚚 [AdminOrders] Loading ShipRocket tracking data for shipment:', shipmentId);
    
    const trackingSub = this.shipRocketService.getTrackingDataForShippingId(shipmentId).subscribe({
      next: (response: any) => {
        console.log('✅ [AdminOrders] ShipRocket tracking data loaded:', response);
        this.shipRocketTrackingData[shipmentId] = response.tracking_data;
      },
      error: (error) => {
        console.error('❌ [AdminOrders] Error loading ShipRocket tracking data:', error);
        this.shipRocketTrackingData[shipmentId] = null;
      }
    });
    
    this.subscriptions.push(trackingSub);
  }

  getShipRocketTrackingData(order: OrderDTO): any {
    if (!order.dispatchSummary?.shipmentId) {
      return null;
    }
    return this.shipRocketTrackingData[order.dispatchSummary.shipmentId];
  }

  hasShipRocketTrackingData(order: OrderDTO): boolean {
    const trackingData = this.getShipRocketTrackingData(order);
    return trackingData && trackingData.shipment_track && trackingData.shipment_track.length > 0;
  }

  getShipRocketTrackUrl(order: OrderDTO): string {
    const trackingData = this.getShipRocketTrackingData(order);
    return trackingData?.track_url || '';
  }
}