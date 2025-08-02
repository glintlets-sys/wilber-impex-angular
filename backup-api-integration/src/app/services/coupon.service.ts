import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartAmountBasedCoupon, Coupon, CouponApplicationResponse, CouponRequest, CouponDefinition, FlatDiscountCoupon, OneTimePercentDiscount } from './coupon';
import { environment } from 'src/environments/environment';
import { LoadingOverlayService } from './loading-overlay.service';
import { ToasterService } from './toaster.service';
import { ToastType } from './toaster';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
 

  constructor(private http: HttpClient, private loadingService: LoadingOverlayService, private toaster: ToasterService) { }

  baseUrl: string = environment.serviceURL + "coupons"

  private couponsBehavior: BehaviorSubject<Coupon[]> = new BehaviorSubject<Coupon[]>([]);
  private coupons$ = this.couponsBehavior.asObservable();

  private couponAppliedBehavior: BehaviorSubject<CouponApplicationResponse> = new BehaviorSubject<CouponApplicationResponse>(null);
  private couponApplied$ = this.couponAppliedBehavior.asObservable();

  getCouponApplied(): Observable<CouponApplicationResponse>{
    return this.couponApplied$;
  }

  resetCouponApplied() {
    this.couponAppliedBehavior.next(null);
  }

  getCoupons(): Observable<Coupon[]> {
    return this.coupons$;
  }

  loadCoupons() {
    this.loadingService.showLoadingOverlay("Loading...", 5000);
    this.http.get<Coupon[]>(this.baseUrl).subscribe(val=>{
      this.couponsBehavior.next(val);
      this.loadingService.hideLoadingOverlay();
    })

  }

  getCouponTypes(): string[] {
    return Object.keys(CouponDefinition).filter((type) => isNaN(Number(type)));
  }

  createOneTimePercentDiscount(coupon: OneTimePercentDiscount): Observable<Coupon> {
    return this.http.post<Coupon>(this.baseUrl + '/create-one-time-discount-coupon', coupon);
  }

  createFlatDiscountCoupon(coupon: FlatDiscountCoupon): Observable<Coupon> {
    return this.http.post<Coupon>(this.baseUrl + '/create-flat-discount-coupon', coupon);
  }

  createCartAmountBasedCoupon(coupon: CartAmountBasedCoupon): Observable<Coupon> {
    return this.http.post<Coupon>(this.baseUrl + '/create-amount-based-discount-coupon', coupon);
  }

  updateCoupon(id: number, coupon: Coupon): Observable<Coupon> {
    return this.http.put<Coupon>(this.baseUrl + '/' + id, coupon);
  }

  applyCoupon(couponApply: CouponRequest) {
    this.http.post<CouponApplicationResponse>(this.baseUrl + '/apply', couponApply).subscribe((val:CouponApplicationResponse) =>{
      
      if(val.success) {
        this.couponAppliedBehavior.next(val);
        this.toaster.showToast(val.message, ToastType.Success, 2000);
      } else {
        this.toaster.showToast(val.message, ToastType.Error, 3000);
      }
    })
  }

  

}
