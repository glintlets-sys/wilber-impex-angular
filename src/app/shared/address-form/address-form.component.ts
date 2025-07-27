import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService, Address, CreateAddressRequest, UpdateAddressRequest } from '../../services/address.service';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  @Input() address: Address | null = null; // For editing existing address
  @Input() showTitle: boolean = true;
  @Input() submitButtonText: string = 'Add Address';
  @Output() addressSaved = new EventEmitter<Address>();
  @Output() cancelled = new EventEmitter<void>();

  addressForm: CreateAddressRequest = {
    label: 'home',
    fullName: '',
    mobile: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  };

  loading = false;
  errorMessage = '';
  validationErrors: string[] = [];

  constructor(private addressService: AddressService) {}

  ngOnInit(): void {
    if (this.address) {
      // Editing existing address
      this.addressForm = {
        label: this.address.label,
        fullName: this.address.fullName,
        mobile: this.address.mobile,
        addressLine1: this.address.addressLine1,
        addressLine2: this.address.addressLine2 || '',
        city: this.address.city,
        state: this.address.state,
        pincode: this.address.pincode,
        isDefault: this.address.isDefault
      };
      this.submitButtonText = 'Update Address';
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.validationErrors = [];

    // Validate address
    const validation = this.addressService.validateAddress(this.addressForm);
    if (!validation.isValid) {
      this.validationErrors = validation.errors;
      this.loading = false;
      return;
    }

    if (this.address) {
      // Update existing address
      const updateRequest: UpdateAddressRequest = {
        id: this.address.id,
        ...this.addressForm
      };

      this.addressService.updateAddress(updateRequest).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success && response.address) {
            this.addressSaved.emit(response.address);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to update address';
        }
      });
    } else {
      // Add new address
      this.addressService.addAddress(this.addressForm).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success && response.address) {
            this.addressSaved.emit(response.address);
            this.resetForm();
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to add address';
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  private resetForm(): void {
    this.addressForm = {
      label: 'home',
      fullName: '',
      mobile: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    };
  }

  // Auto-fill mobile from user profile if available
  fillUserMobile(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.mobile && !this.addressForm.mobile) {
      this.addressForm.mobile = currentUser.mobile;
    }
  }

  // Auto-fill name from user profile if available
  fillUserName(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.firstName && currentUser.lastName && !this.addressForm.fullName) {
      this.addressForm.fullName = `${currentUser.firstName} ${currentUser.lastName}`;
    }
  }
} 