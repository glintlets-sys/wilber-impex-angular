import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AddressService, Address } from 'src/app/services/address.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastType } from 'src/app/services/toaster';

@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss']
})


export class DeliveryAddressComponent implements OnInit, OnDestroy {

  public showNewAddressForm: boolean;
  selectedDeleteAddress: Address | null = null;
  addresses: Address[] = [];
  selectedAddress: Address | undefined;
  showManageSection = false;
  newAddress: Address = {
    id: 0,
    firstLine: '',
    userId: 0,
    secondLine: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    mobileNumber: '',
    alternateNumber: '',
    emailAddress: '',
    isDefault: true
  };

  check_address: boolean = true;
  // stored_latest_address: Address;
  check_selected_address: boolean = false;

  @Output() set_cart_label: EventEmitter<string> = new EventEmitter();

  constructor(private addressService: AddressService,
    private paymentService: PaymentService,
    private toaster: ToasterService,
  ) {
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.refreshAddresses();
  }

  refreshAddresses() {
    this.addressService.getAllAddresses().subscribe(val => {
      this.addresses = val;
      this.selectedAddress = this.addresses.find(address => address.isDefault === true);
      this.check_selected_address = !!this.selectedAddress; // Convert to boolean directly
    });
  }

  changeAddress(event: any, address: Address): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.paymentService.setSelectedAddress(address);
      this.defaultAddress(address);
    }

    else {
      this.paymentService.setSelectedAddress(undefined);
      this.selectedAddress = undefined;
      address.isDefault = false;
      this.updateAddress(address)
    }
  }

  updateAddress(address: Address) {
    this.addressService.updateAddress(address).subscribe(val => {
      this.selectedAddress = val
      this.refreshAddresses()
    });
  }

  defaultAddress(address: Address) {
    this.addressService.makeDefaultAddress(address).subscribe(val => {
      this.selectedAddress = val
      this.refreshAddresses()
    });
  }

  saveNewAddress() {
    if (!this.check_selected_address) {
      const requiredFields = ['firstLine', 'city', 'state', 'pincode', 'mobileNumber', 'emailAddress'];

      for (const field of requiredFields) {
        if (this.newAddress[field] === '') {
          this.toaster.showToast(`Please enter the ${field}`, ToastType.Error, 3000);
          return;
        }

        if (this.newAddress.pincode?.length < 6) {
          this.toaster.showToast(`Picode should be 6 digits.`, ToastType.Error, 3000);
          return;
        }

        if (this.newAddress.mobileNumber?.length < 10) {
          this.toaster.showToast(`Mobile number should be 10 digits.`, ToastType.Error, 3000);
          return;
        }

      }

      this.addressService.addAddress(this.newAddress).subscribe((val) => {
        this.paymentService.setSelectedAddress(val);
        // this.stored_latest_address = val;
        this.refreshAddresses();
      });
    } else {
      const selectedAddressFields = ['firstLine', 'city', 'state', 'pincode', 'mobileNumber', 'emailAddress'];

      for (const field of selectedAddressFields) {
        if (this.newAddress[field] !== '') {
          this.toaster.showToast("You have already selected one address", ToastType.Error, 3000);
          return;
        }
      }

      this.paymentService.setSelectedAddress(this.selectedAddress);
    }

    this.setCartLabel("payment");
    this.cancelNewAddress();
  }

  cancelNewAddress() {
    this.newAddress = {
      id: 0,
      userId: 0,
      firstLine: '',
      secondLine: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      mobileNumber: '',
      alternateNumber: '',
      emailAddress: '',
      isDefault: false
    }
    this.showNewAddressForm = false;
  }

  deleteAddress() {
    if (this.selectedDeleteAddress) {
      this.addressService.deleteAddress(this.selectedDeleteAddress).subscribe(val => {
        this.refreshAddresses();
        if (this.selectedDeleteAddress === this.selectedAddress) {
          this.paymentService.setSelectedAddress(undefined);
        }
        this.selectedDeleteAddress = null;
      });
    }
  }

  setCartLabel(message: string) {
    this.set_cart_label.emit(message)
  }

  ngOnDestroy(): void {
    this.check_address = true;
  }

}
