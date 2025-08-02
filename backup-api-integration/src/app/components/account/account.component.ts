import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/services/user';
import axios from 'axios';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastType } from 'src/app/services/toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDoneComponent } from '../payment-done/payment-done.component';
import { Location } from '@angular/common';
import { Address, AddressService } from 'src/app/services/address.service';
import { ConfigurationService } from 'src/app/services/configurationService/configuration.service';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  username: string;
  user: User;
  isAdminUser: boolean = false;

  selectedPage: string = 'profile-settings';

  toggleProfileView: boolean = true;
  toggleOrdersView: boolean;
  toggleCustomersView: boolean;
  toggleCategoriesView: boolean;
  toggleManageItemsView: boolean;
  toggleAllOrdersView: boolean;
  toggleStockView: boolean;
  toggleConsignmentView: boolean;
  toggleCustomerCartView: boolean;
  toggleManageCouponView: boolean;
  toggleClientProfileView: boolean;
  toggleManageAdminUsersView: boolean;
  toggleRecommendedItemsView: boolean;
  togglePlatformView: boolean;
  togglePaymentView: boolean;
  toggleSmsView: boolean;
  toggleShippingView: boolean;
  toggleboughtTogetherView: boolean;
  toggleAddressView: boolean;
  toggleManageNotifyMeView: boolean
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
  profileUserName: string = '';
  firstLetterUseName: string = '';
  isToggled: boolean = false;  // This variable is bound to the switch
  addresses: Address[] = [];
  add_address: boolean = false;
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
    isDefault: false
  };
  // currentUrlForOrderSuccess: string = '';
  constructor(private userService: UserService,
    private authService: AuthenticationService,
    private toaster: ToasterService,
    private loadingService: LoadingOverlayService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private addressService: AddressService,
    private location: Location, 
    private configService: ConfigurationService) {

    const currentUrl = this.activatedRoute.snapshot['_routerState'].url;
    let routeParam = currentUrl.split('/').pop();
    // this.currentUrlForOrderSuccess=routeParam
    if (routeParam == "orderHistory") {
      this.toggleOrders()
    }

    if (routeParam == ("orderSuccess")) {
      toaster.showToast("Your order has been placed succefully.", ToastType.Success, 3000);
      window.scrollTo(0, 0);
      const dialogRef = this.dialog.open(PaymentDoneComponent, {
        width: '250px'
      });

      dialogRef.afterClosed().subscribe(result => {
        // this.currentUrlForOrderSuccess=result;
        if (result == "orderSuccess") {
          this.toggleOrders()
          // this.router.navigate(['myaccount/orderHistory']);
        }
      });
    }

    this.userService.userName$.subscribe(val => {
      if (val != '') {
        this.profileUserName = val
      } else {
        this.profileUserName = localStorage.getItem('userName') ?? '';
      }
      this.firstLetterUseName = this.profileUserName.charAt(0);
    })

  }

  ngOnInit() {
    if (localStorage.getItem("userDetails") !== "") {
      this.username = JSON.parse(localStorage.getItem("userDetails")).username; // Set the username
      this.getUserData();
      this.isAdminUser = this.authService.isUserAdmin();
      if (this.isAdminUser) {
        this.toggleProfileView = false;
        this.toggleClientProfileView = true;
        this.configService.fetchIsSitePaymentEnabled().subscribe(val=>{
          if(val){
            this.isToggled = val;
          }
        })
      }
    }
    window.scrollTo(0, 0);
  }

  onToggleClick() {
    setTimeout(()=>{
      this.configService.updateIsSitePaymentEnabled(this.isToggled).subscribe(val=>{
        this.isToggled = val;
      })
    },100);
  }

  private reset() {
    this.toggleOrdersView = false;
    this.toggleProfileView = false;
    this.toggleCustomersView = false;
    this.toggleCategoriesView = false;
    this.toggleManageItemsView = false;
    this.toggleAllOrdersView = false;
    this.toggleStockView = false;
    this.toggleConsignmentView = false;
    this.toggleCustomerCartView = false;
    this.toggleManageCouponView = false;
    this.toggleClientProfileView = false;
    this.toggleManageAdminUsersView = false;
    this.toggleRecommendedItemsView = false;
    this.togglePlatformView = false;
    this.togglePaymentView = false;
    this.toggleSmsView = false;
    this.toggleShippingView = false;
    this.toggleboughtTogetherView = false;
    this.toggleAddressView = false;
    this.toggleManageNotifyMeView = false;
  }

  public toggleManageAdminUsers() {
    this.reset();
    this.toggleManageAdminUsersView = !this.toggleManageAdminUsersView;
  }
  public toggleProfile() {
    this.router.navigate(['/myaccount'])
    this.reset();
    this.toggleProfileView = !this.toggleProfileView;
  }
  public toggleOrders() {
    this.reset();
    this.toggleOrdersView = !this.toggleOrdersView;
  }

  public toggleAddress() {
    this.reset();
    this.toggleAddressView = !this.toggleAddressView;
    if (this.toggleAddressView) {
      this.refreshAddresses();
    }
  }

  refreshAddresses() {
    this.addressService.getAllAddresses().subscribe(val => {
      this.addresses = val;
    });
  }

  addAdress() {
    this.add_address = true;
  }

  cancelNewAddress() {
    this.add_address = false;
    this.clearAddressData();
  }

  saveNewAddress() {
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
      this.add_address = false;
      this.clearAddressData()
      this.refreshAddresses();
    });
  }

  clearAddressData() {
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
  }

  deleteAddress(address) {
    this.addressService.deleteAddress(address).subscribe(val => {
      this.refreshAddresses();
    });
  }

  // Admin related methods: 
  public toggleCustomers() {
    this.reset();
    this.toggleCustomersView = !this.toggleCustomersView;
  }

  public toggleClientProfile() {
    this.reset();
    this.toggleClientProfileView = !this.toggleClientProfileView;
  }

  public toggleCategories() {
    this.reset();
    this.toggleCategoriesView = !this.toggleCategoriesView;
  }

  public toggleManageItems() {
    this.reset();
    this.toggleManageItemsView = !this.toggleManageItemsView;
  }

  public toggleBoughtTogether() {
    this.reset();
    this.toggleboughtTogetherView = !this.toggleboughtTogetherView;
  }

  public toggleAllOrders() {
    this.reset();
    this.toggleAllOrdersView = !this.toggleAllOrdersView;
  }

  public toggleStock() {
    this.reset();
    this.toggleStockView = !this.toggleStockView;
  }

  public toggleConsignment() {
    this.reset();
    this.toggleConsignmentView = !this.toggleConsignmentView;
  }

  public toggleCustomerCart() {
    this.reset();
    this.toggleCustomerCartView = !this.toggleCustomerCartView;
  }

  public toggleManageCoupon() {
    this.reset();
    this.toggleManageCouponView = !this.toggleManageCouponView;
  }

  toggleManageNotify() {
    this.reset();
    this.toggleManageNotifyMeView = !this.toggleManageNotifyMeView;
  }

  public toggleRecommendedItems() {
    this.reset();
    this.toggleRecommendedItemsView = !this.toggleRecommendedItemsView;
  }

  public togglePlatform() {
    this.reset();
    this.togglePlatformView = !this.togglePlatformView;
  }

  public togglePayment() {
    this.reset();
    this.togglePaymentView = !this.togglePaymentView;
  }

  public toggleSms() {
    this.reset();
    this.toggleSmsView = !this.toggleSmsView;
  }

  public toggleShipping() {
    this.reset();
    this.toggleShippingView = !this.toggleShippingView;
  }

  // Function to toggle sections
  public toggleSection(section: string): void {
    this.sections[section] = !this.sections[section];
  }

  selectPage(page: string) {
    this.selectedPage = page;
  }

  logout() {
    localStorage.removeItem('userName')
    this.authService.logoutUser();
    this.toaster.showToast("You have been logged out!", ToastType.Info, 3000);
    this.router.navigateByUrl('/');
    this.userService.storeuserNameData.next('')
  }

  getUserData() {
    this.userService.getUserByUsername(this.username)
      .subscribe(
        (user: User) => {
          this.user = user;
          if (!this.user.email) {
            this.toaster.showToast("Please fill in email Address for communications. ", ToastType.Info, 3000);
          }
        },
        (error) => {
        }
      );
  }

  saveUser() {
    this.loadingService.showLoadingOverlay();
    this.userService.updateUserByUsername(this.username, this.user)
      .subscribe(
        (updatedUser: User) => {
          this.user = updatedUser;
          this.userService.storeuserNameData.next(this.user.name);
          localStorage.setItem('userName', this.user.name)
          this.loadingService.hideLoadingOverlay();
          this.toaster.showToast("User information has been updated", ToastType.Success, 3000);
        },
        (error) => {
          this.loadingService.hideLoadingOverlay();
          this.toaster.showToast("Sorry! :( something went wrong. Please try after sometime or contact glintlets@gmail.com for further concern or assistance.", ToastType.Error, 3000)
        }
      );
  }

  validatePincode() {
    const pincode = this.user.pincode;
    axios.get(`https://api.postalpincode.in/pincode/${pincode}`)
      .then(response => {
        const pincodeData = response.data[0];

        if (pincodeData && pincodeData.Status === 'Success') {
          this.user.state = pincodeData.PostOffice[0].State;
          this.user.city = pincodeData.PostOffice[0].Name;
        } else {
        }
      })
      .catch(error => {
        console.error('Error fetching pincode data:', error);
      });
  }

  // canDeactivate(): boolean {
  //   if (this.currentUrlForOrderSuccess=="orderSuccess") {
  //     this.replaceUrlWithHome(); 
  //     return false;
  //   }
  //   return true;
  // }

  // replaceUrlWithHome(): void {
  //   this.location.replaceState('/');
  // }
}
