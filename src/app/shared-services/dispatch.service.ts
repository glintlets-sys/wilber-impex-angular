import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { DispatchSummary, SHIPMENTSTATUS } from './dispatchSummary';
import { environment } from '../../environments/environment';
import { OrderDTO } from './order';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ShiprocketService } from './shiprocket/shiprocket.service';
import { UserSelections } from './configurationInterface/userSelections';
import { ConfigurationService } from './configurationService/configuration.service';
import { ToasterService } from './toaster.service';
import { ToastType } from './toaster';
import { SR_CustomOrderResponse, ShippingProviders } from './configurationInterface/shipping';

@Injectable({
  providedIn: 'root'
})
export class DispatchService{


  private apiUrl = environment.serviceURL; // Replace with your API endpoint
  userSelections: UserSelections;
  selectedShippingProvider: string;
 
  constructor(private http: HttpClient, 
    private configurationService: ConfigurationService,
    private shipRocketService: ShiprocketService, 
    private toaster: ToasterService) {
      
      this.configurationService.userSelectionsObservable$.subscribe((val: UserSelections)=>{
        console.log('🔧 [DispatchService] Received user selections:', val);
        this.userSelections = val;
        if((this.userSelections!= null) && (this.userSelections.primaryShippingProvder!="")) {
          console.log("✅ [DispatchService] Initialized with shipping provider: " + this.userSelections.primaryShippingProvder);
          this.selectedShippingProvider = this.userSelections.primaryShippingProvder;
        } else {
          console.warn('⚠️ [DispatchService] User selections received but primaryShippingProvder is empty or null');
        }
      }, (error) => {
        console.error('❌ [DispatchService] Error loading user selections:', error);
      });

    }

  getDispatchSummaryById(dispatchId: number): Observable<DispatchSummary> {
    const url = `${this.apiUrl}api/dispatch-summaries/${dispatchId}`;
    return this.http.get<DispatchSummary>(url);
  }

  updateDispatchSummary(dispatchSummary: DispatchSummary): Observable<DispatchSummary> {
    const url = `${this.apiUrl}api/dispatch-summaries/${dispatchSummary.id}`;
    return this.http.put<DispatchSummary>(url, dispatchSummary);
  }


  // Check if configuration is ready
  isConfigurationReady(): boolean {
    return !!(this.userSelections && this.userSelections.primaryShippingProvder);
  }

  // Get configuration status for debugging
  getConfigurationStatus(): any {
    return {
      userSelectionsLoaded: !!this.userSelections,
      primaryShippingProvider: this.userSelections?.primaryShippingProvder || 'NOT_SET',
      selectedShippingProvider: this.selectedShippingProvider || 'NOT_SET'
    };
  }

  sendToShippingProvider(order: OrderDTO): Observable<any> {
    console.log('🚚 [DispatchService] Attempting to send order to shipping provider. Configuration status:', this.getConfigurationStatus());
    
    // Check if userSelections is null or undefined
    if (!this.userSelections) {
      console.error('❌ [DispatchService] userSelections is null or undefined');
      this.toaster.showToast("Shipping configuration not loaded. Please wait a moment and try again, or refresh the page.", ToastType.Error, 5000);
      return throwError(() => new Error("Shipping configuration not loaded"));
    }

    // Check if primaryShippingProvder is null, undefined, or empty
    if (!this.userSelections.primaryShippingProvder || this.userSelections.primaryShippingProvder === "") {
      console.error('❌ [DispatchService] primaryShippingProvder is not configured:', this.userSelections.primaryShippingProvder);
      this.toaster.showToast("Shipping provider not configured. Please contact support to configure shipping settings.", ToastType.Error, 5000);
      return throwError(() => new Error("Shipping provider not configured"));
    }

    if (this.userSelections.primaryShippingProvder == ShippingProviders.ShipRocket) {
      console.log('✅ [DispatchService] Sending order to ShipRocket');
      return this.sendToShipRocket(order).pipe(
        switchMap((specificResponse: SR_CustomOrderResponse) => {
          // Use switchMap to chain another Observable operation
          return this.saveTheShipRocketResponseToDispatchDetails(specificResponse, order);
        }),
        catchError(error => {
          // Handle any errors that might occur during the save operation
          console.error('❌ [DispatchService] Error saving dispatch details', error);
          return throwError(() => new Error('Error saving dispatch details'));
        })
      );
    } else {
      console.error('❌ [DispatchService] Invalid shipping provider:', this.userSelections.primaryShippingProvder);
      this.toaster.showToast("Invalid configuration for shipping provider. Please contact support", ToastType.Error, 5000);
      // Returning an error Observable if the condition is not met
      return throwError(() => new Error("Invalid configuration for shipping provider."));
    }
  }

  sendToShipRocket(order: OrderDTO): Observable<any> {
    return this.shipRocketService.sendOrderForShipment(order);
  }
  
  saveTheShipRocketResponseToDispatchDetails(specificResponse: SR_CustomOrderResponse, order: OrderDTO): Observable<any> {
    this.updateShippingDetailsInDispatchSummary(order.dispatchSummary, specificResponse);
    return this.updateDispatchSummary(order.dispatchSummary)
  }
  
  updateShippingDetailsInDispatchSummary(dispatchSummary: DispatchSummary, specificResponse: SR_CustomOrderResponse) {
    dispatchSummary.courierService = specificResponse.courier_name;
    dispatchSummary.shipmentId = specificResponse.shipment_id+"";
    if(specificResponse.status === "NEW")
    {
      dispatchSummary.shipmentStatus = SHIPMENTSTATUS.READYTODISPATCH;
    }
    dispatchSummary.orderId - specificResponse.order_id;    
  }
  
  
}
