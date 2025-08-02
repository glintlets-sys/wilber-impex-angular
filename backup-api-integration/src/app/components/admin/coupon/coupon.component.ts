import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Coupon } from 'src/app/services/coupon';
import { CouponService } from 'src/app/services/coupon.service';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { LoadingOverlayComponent } from 'src/app/shared/loading-overlay/loading-overlay.component';
import { AddEditCouponComponent } from './add-edit-coupon/add-edit-coupon.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {

  public coupons: Coupon[] = [];
  editCoupon: boolean = false
  selectedCouponData: any
  tableSize = environment.tableSize;
  page: number = 1;
  count: number = 0;
  statickCoupon: Coupon[] = [];
  searchCoupon: any = "";

  constructor(private couponService: CouponService,
    private loadingService: LoadingOverlayService,
    private modalService: NgbModal) {

  }

  isExpired(endDate: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to 00:00:00 for accurate comparison
    const expiryDate = new Date(endDate);
    return expiryDate < today;
  }

  ngOnInit(): void {
    this.getCoupon()
  }

  getCoupon() {
    this.couponService.loadCoupons();
    this.couponService.getCoupons().subscribe((data) => {
      this.coupons = data;
      this.statickCoupon = [...data]
      this.count = this.coupons?.length;
    })
  }

  openAddEditCoupon(coupon: string) {
    const modalRef = this.modalService.open(AddEditCouponComponent, {
      size: "xl",
    });

    if (coupon) {
      modalRef.componentInstance.editCoupon = coupon;
    }

    modalRef.result.then(() => {
      this.getCoupon()
    })
  }

  filterData(): void {
    this.coupons = this.statickCoupon.filter(coupon =>
      coupon?.couponCode?.toLowerCase().includes(this.searchCoupon) || coupon?.couponDefinition?.toLowerCase().includes(this.searchCoupon)
    );

    this.count = this.coupons?.length
    this.page = 1;

  }
}
