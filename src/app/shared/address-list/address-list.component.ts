import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressService, Address } from '../../services/address.service';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent {
  @Input() addresses: Address[] = [];
  @Input() selectedAddress: Address | null = null;
  @Input() showActions: boolean = true;
  @Input() showSelection: boolean = false;
  @Input() emptyMessage: string = 'No addresses found';
  @Input() emptyIcon: string = 'fas fa-map-marker-alt';
  @Input() emptySubMessage: string = 'Add your first address to get started';

  @Output() addressSelected = new EventEmitter<Address>();
  @Output() addressEdited = new EventEmitter<Address>();
  @Output() addressDeleted = new EventEmitter<string>();
  @Output() addressSetDefault = new EventEmitter<string>();
  @Output() addNewAddress = new EventEmitter<void>();

  constructor(private addressService: AddressService) {}

  onAddressSelect(address: Address): void {
    this.addressSelected.emit(address);
  }

  onAddressEdit(address: Address): void {
    this.addressEdited.emit(address);
  }

  onAddressDelete(addressId: string): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addressDeleted.emit(addressId);
    }
  }

  onSetDefault(addressId: string): void {
    this.addressSetDefault.emit(addressId);
  }

  onAddNewAddress(): void {
    this.addNewAddress.emit();
  }

  getAddressLabelClass(label: string): string {
    switch (label) {
      case 'home': return 'bg-primary';
      case 'office': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getAddressLabelText(label: string): string {
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  isSelected(address: Address): boolean {
    return this.selectedAddress?.id === address.id;
  }
} 