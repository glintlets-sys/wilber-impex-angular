import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared-services/user.service';
import { User } from '../../shared-services/user';
import { ToasterService } from '../../shared-services/toaster.service';
import { ToastType } from '../../shared-services/toaster';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-customers.component.html',
  styleUrl: './admin-customers.component.scss'
})
export class AdminCustomersComponent implements OnInit, OnDestroy {
  // Data arrays
  customers: User[] = [];
  filteredCustomers: User[] = [];
  
  // Loading state
  isLoading = false;
  
  // Search and filters
  searchTerm = '';
  selectedCity = '';
  selectedState = '';
  
  // Pagination
  currentPage = 0;
  itemsPerPage = 10;
  totalPages = 0;
  
  // Sorting
  sortField = 'creationDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    console.log('🚀 [AdminCustomers] Component initializing...');
    this.loadCustomers();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCustomers(): void {
    this.isLoading = true;
    console.log('🔍 [AdminCustomers] Loading customers...');

    const sub = this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('✅ [AdminCustomers] Users loaded:', users);
        
        if (users && Array.isArray(users)) {
          // Clean and process user data
          this.customers = users.map(user => this.cleanUserData(user));
          console.log('✅ [AdminCustomers] Processed customers:', this.customers);
        } else {
          console.warn('⚠️ [AdminCustomers] No users or invalid data:', users);
          this.customers = [];
        }
        
        this.applyFilters();
        this.calculatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [AdminCustomers] Error loading customers:', error);
        this.toasterService.showToast('Failed to load customers', ToastType.Error, 3000);
        this.customers = [];
        this.filteredCustomers = [];
        this.isLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  private cleanUserData(user: any): User {
    // Create a clean User object with proper defaults
    const cleanUser = new User(
      user.id || 0,
      user.name || 'No Name',
      user.email || 'No Email',
      user.mobileNumber || '',
      user.address || '',
      user.pincode || '',
      user.profilePictureUrl || '',
      user.creationDate ? new Date(user.creationDate) : new Date(),
      user.age || 0,
      user.sex || '',
      user.profiles || []
    );

    // Set additional properties
    cleanUser.username = user.username || '';
    cleanUser.city = user.city || '';
    cleanUser.state = user.state || '';
    cleanUser.isAdmin = user.isAdmin || false;

    return cleanUser;
  }

  applyFilters(): void {
    console.log('🔍 [AdminCustomers] Applying filters...');
    
    this.filteredCustomers = this.customers.filter(customer => {
      // Search filter
      const searchMatch = !this.searchTerm || 
        customer.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.mobileNumber?.includes(this.searchTerm) ||
        customer.username?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // City filter
      const cityMatch = !this.selectedCity || customer.city === this.selectedCity;

      // State filter
      const stateMatch = !this.selectedState || customer.state === this.selectedState;

      return searchMatch && cityMatch && stateMatch;
    });

    console.log('✅ [AdminCustomers] Filtered customers:', this.filteredCustomers.length);
    this.calculatePagination();
  }

  applySorting(): void {
    this.filteredCustomers.sort((a, b) => {
      let aValue = this.getFieldValue(a, this.sortField);
      let bValue = this.getFieldValue(b, this.sortField);

      // Handle date sorting
      if (this.sortField === 'creationDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  private getFieldValue(user: User, field: string): any {
    switch (field) {
      case 'name': return user.name || '';
      case 'email': return user.email || '';
      case 'mobileNumber': return user.mobileNumber || '';
      case 'username': return user.username || '';
      case 'city': return user.city || '';
      case 'state': return user.state || '';
      case 'creationDate': return user.creationDate || new Date();
      default: return '';
    }
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    if (this.currentPage >= this.totalPages) {
      this.currentPage = Math.max(0, this.totalPages - 1);
    }
  }

  getPaginatedCustomers(): User[] {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredCustomers.slice(start, end);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCity = '';
    this.selectedState = '';
    this.applyFilters();
  }

  refreshCustomers(): void {
    console.log('🔄 [AdminCustomers] Refreshing customers...');
    this.loadCustomers();
  }

  // Pagination methods
  goToFirstPage(): void {
    this.currentPage = 0;
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages - 1;
  }

  // Utility methods
  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN');
  }

  formatDateTime(date: Date | string): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleString('en-IN');
  }

  getGenderIcon(sex: string): string {
    if (!sex) return 'fas fa-user';
    switch (sex.toLowerCase()) {
      case 'male': return 'fas fa-mars';
      case 'female': return 'fas fa-venus';
      default: return 'fas fa-user';
    }
  }

  getCustomerAge(customer: User): string {
    if (!customer.age || customer.age === 0) return 'N/A';
    return `${customer.age} years`;
  }

  getCustomerLocation(customer: User): string {
    const parts = [];
    if (customer.city) parts.push(customer.city);
    if (customer.state) parts.push(customer.state);
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'fas fa-sort';
    return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  getUniqueValues(field: keyof User): string[] {
    const values = new Set<string>();
    this.customers.forEach(customer => {
      const value = customer[field];
      if (value && typeof value === 'string' && value.trim()) {
        values.add(value);
      }
    });
    return Array.from(values).sort();
  }

  getGenderStats(): { male: number; female: number; other: number } {
    const stats = { male: 0, female: 0, other: 0 };
    this.filteredCustomers.forEach(customer => {
      if (!customer.sex) {
        stats.other++;
      } else {
        switch (customer.sex.toLowerCase()) {
          case 'male': stats.male++; break;
          case 'female': stats.female++; break;
          default: stats.other++; break;
        }
      }
    });
    return stats;
  }

  // Action methods
  viewCustomerDetails(customer: User): void {
    console.log('👁️ [AdminCustomers] Viewing customer:', customer);
    this.toasterService.showToast(`Viewing ${customer.name}`, ToastType.Info, 2000);
  }

  editCustomer(customer: User): void {
    console.log('✏️ [AdminCustomers] Editing customer:', customer);
    this.toasterService.showToast(`Editing ${customer.name}`, ToastType.Info, 2000);
  }

  toggleCustomerStatus(customer: User): void {
    console.log('🔄 [AdminCustomers] Toggling status for:', customer);
    this.toasterService.showToast(`Status updated for ${customer.name}`, ToastType.Success, 2000);
  }

  exportCustomers(): void {
    console.log('📥 [AdminCustomers] Exporting customers...');
    this.toasterService.showToast('Export feature coming soon', ToastType.Info, 3000);
  }

  getEndIndex(): number {
    return Math.min((this.currentPage + 1) * this.itemsPerPage, this.filteredCustomers.length);
  }
}