import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CartAmountBasedCoupon, Coupon, CouponDefinition, FlatDiscountCoupon, OneTimePercentDiscount } from 'src/app/services/coupon';
import { CouponService } from 'src/app/services/coupon.service';
import { ToastType } from 'src/app/services/toaster';
import { ToasterService } from 'src/app/services/toaster.service';


@Component({
  selector: 'app-add-edit-coupon',
  templateUrl: './add-edit-coupon.component.html',
  styleUrls: ['./add-edit-coupon.component.scss']
})
export class AddEditCouponComponent implements OnInit {
  @Input() editCoupon: any
  couponTypes: string[] = [];
  selected_coupon: string;

  public one_time_percent_dicount: OneTimePercentDiscount = { couponCode: '', startDate: '', numOfDays: 0, discountPercent: 0 };
  public flat_discount_coupon: FlatDiscountCoupon = { couponCode: '', startDate: '', numOfDays: 0, percentDiscount: false, minOrder: 0, discountAmount: 0 };
  public cart_amount_based_coupon: CartAmountBasedCoupon = { couponCode: '', startDate: '', numOfDays: 0, percentDiscount: false, discountLimits: {} };
  public edit_couponData: Coupon = {
    id: 0,
    couponType: '',
    couponCode: '',
    description: null,
    active: false,
    startDate: '',
    endDate: '',
    couponBenefits: [],
    couponDefinition: null,
    usageLimits: {
      oneTimeUsePerUser: false,
      allowAllUsers: false,
      allowAllItems: false,
      maxQuantityAllowedPerItem: 0,
      canBeApplyAboveItemDiscount: false,
      minPurchaseAmountLimit: 0,
      usageCountRestricted: false,
      maxNumberOfTimesCouponCanBeUsed: 0,
      maxDiscountAmountAllocatedForThisCoupon: 0,
    }

  };
  couponId: any;
  @ViewChild('amountInput') amountInput: ElementRef;
  @ViewChild('discountInput') discountInput: ElementRef;

  constructor(public modal: NgbActiveModal, private couponService: CouponService,
    private toaster: ToasterService,
  ) { }

  ngOnInit(): void {
    if (this.editCoupon != undefined) {
      this.loadCouponData()
    }
    else {
      this.getCouponTypes()
    }
  }

  loadCouponData() {
    this.couponId = this.editCoupon.id
    this.edit_couponData = this.editCoupon;
  }

  getCouponTypes() {
    this.couponTypes = this.couponService.getCouponTypes();
  }

  getSelectedCoupon(coupon) {
    this.selected_coupon = coupon.target.value
  }

  addDiscountLimit(amount: number = null, discount: number = null, coupon: any) {
    if (!amount) {
      this.toaster.showToast("Please enter discount amount", ToastType.Warn, 3000);
      return;
    }
    if (!discount) {
      this.toaster.showToast("Please enter discount", ToastType.Warn, 3000);
      return;
    }
    if (amount !== null && discount !== null) {
      coupon.discountLimits[amount] = discount;
      this.amountInput.nativeElement.value = ''; 
      this.discountInput.nativeElement.value = ''; 
    }
  }

  removeDiscountLimit(amount: number, coupon: any) {
    delete coupon.discountLimits[amount];
  }

  saveCoupon() {
    if (this.selected_coupon == CouponDefinition.OneTimePercentDiscount) {
      const requiredFields = ['couponCode', 'startDate'];
      for (const field of requiredFields) {
        if (this.one_time_percent_dicount[field] === '') {
          this.toaster.showToast(`Please enter the ${field}`, ToastType.Error, 3000);
          return;
        }
      }

      this.couponService.createOneTimePercentDiscount(this.one_time_percent_dicount).subscribe((val) => {
        this.couponService.loadCoupons();
        this.modal.close();
      })
    } else if (this.selected_coupon == CouponDefinition.FlatDiscountCoupon) {
      const requiredFields = ['couponCode', 'startDate'];
      for (const field of requiredFields) {
        if (this.flat_discount_coupon[field] === '') {
          this.toaster.showToast(`Please enter the ${field}`, ToastType.Error, 3000);
          return;
        }
      }
      this.couponService.createFlatDiscountCoupon(this.flat_discount_coupon).subscribe((val) => {
        this.couponService.loadCoupons();
        this.modal.close();
      })
    } else if (this.selected_coupon == CouponDefinition.CartAmountBasedCoupon) {
      const requiredFields = ['couponCode', 'startDate'];
      for (const field of requiredFields) {
        if (this.cart_amount_based_coupon[field] === '') {
          this.toaster.showToast(`Please enter the ${field}`, ToastType.Error, 3000);
          return;
        }
      }
      this.couponService.createCartAmountBasedCoupon(this.cart_amount_based_coupon).subscribe((val) => {
        this.couponService.loadCoupons();
        this.modal.close();
      })
    }
  }

  updateCoupon() {
    this.couponService.updateCoupon(this.couponId, this.edit_couponData).subscribe((val: Coupon) => {
      this.couponService.loadCoupons();
      this.modal.close()
    })
  }

}
