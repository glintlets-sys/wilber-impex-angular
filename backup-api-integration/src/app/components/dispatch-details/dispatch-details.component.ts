import { Component, Input, OnInit } from '@angular/core';
import { DispatchSummary, SHIPMENTSTATUS } from '../../services/dispatchSummary';
import { DispatchService } from '../../services/dispatch.service';
import { ShippingProviders } from 'src/app/services/configurationInterface/shipping';
import { ShiprocketService } from 'src/app/services/shiprocket/shiprocket.service';

@Component({
  selector: 'app-dispatch-details',
  templateUrl: './dispatch-details.component.html',
  styleUrls: ['./dispatch-details.component.scss']
})
export class DispatchDetailsComponent implements OnInit {
 
  @Input() dispatchSummary: DispatchSummary;
  shipmentStatusOptions: SHIPMENTSTATUS[] = Object.values(SHIPMENTSTATUS);
  editMode: boolean = false;
  shippingDetails: any;
  isShipRocketIntegration: boolean = false;

  constructor(private dispatchService: DispatchService, private shipRocketService: ShiprocketService) { }

  ngOnInit() {
    if(this.dispatchService.selectedShippingProvider == ShippingProviders.ShipRocket) {
      this.isShipRocketIntegration = true;
      if(this.dispatchSummary.shipmentId) 
      {
        this.shipRocketService.getTrackingDataForShippingId(this.dispatchSummary.shipmentId).subscribe((val: any)=>{
          this.shippingDetails = val.tracking_data;
        })
      }
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  
  saveDispatchSummary() {
    this.dispatchService.updateDispatchSummary(this.dispatchSummary)
      .subscribe(() => {
        this.editMode = false;
      });
  }
}
