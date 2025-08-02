import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { DispatchSummary, SHIPMENTSTATUS } from '../services/dispatchSummary';
import { environment } from 'src/environments/environment';
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
        this.userSelections = val;
        if((this.userSelections!= null) && (this.userSelections.primaryShippingProvder!="")) {
          console.log("Dispatch Service initialzied with shippign provider : " + this.userSelections.primaryShippingProvder)
          this.selectedShippingProvider = this.userSelections.primaryShippingProvder;
        }
      })

    }

  getDispatchSummaryById(dispatchId: number): Observable<DispatchSummary> {
    const url = `${this.apiUrl}api/dispatch-summaries/${dispatchId}`;
    return this.http.get<DispatchSummary>(url);
  }

  updateDispatchSummary(dispatchSummary: DispatchSummary): Observable<DispatchSummary> {
    const url = `${this.apiUrl}api/dispatch-summaries/${dispatchSummary.id}`;
    return this.http.put<DispatchSummary>(url, dispatchSummary);
  }


  sendToShippingProvider(order: OrderDTO): Observable<any> {
    if (this.userSelections.primaryShippingProvder != "") {
      if (this.userSelections.primaryShippingProvder == ShippingProviders.ShipRocket) {
        return this.sendToShipRocket(order).pipe(
          switchMap((specificResponse: SR_CustomOrderResponse) => {
            // Use switchMap to chain another Observable operation
            return this.saveTheShipRocketResponseToDispatchDetails(specificResponse, order);
          }),
          catchError(error => {
            // Handle any errors that might occur during the save operation
            console.error('Error saving dispatch details', error);
            return throwError(() => new Error('Error saving dispatch details'));
          })
        );
      } else {
        this.toaster.showToast("Invalid configuration for shipping provider. Please contact support", ToastType.Error,3000);
        // Returning an error Observable if the condition is not met
        return throwError(() => new Error("Invalid configuration for shipping provider."));
      }
    } else {
      // This else block seems redundant, as the same check and error handling are done above.
      this.toaster.showToast("Invalid configuration for shipping provider. Please contact support", ToastType.Error,3000);
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
