import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Currency, StockConsignment } from 'src/app/services/StockConsignment';
import { StockConsignmentService } from 'src/app/services/consignment.service';
import { StockService } from 'src/app/services/stock.service';
import { ToyService } from 'src/app/services/toy.service';
import { NgForm, NgModel } from '@angular/forms';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastType } from 'src/app/services/toaster';
import { Variation } from 'src/app/services/toy';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-add-edit-consignment',
  templateUrl: './add-edit-consignment.component.html',
  styleUrls: ['./add-edit-consignment.component.scss']
})
export class AddEditConsignmentComponent implements OnInit {

  consignment: StockConsignment = {
    id: 0,
    dealer: { id: 0, dealerName: '', address: { id: 0, firstLine: '', secondLine: '', city: '', state: '', country: '', pincode: '', mobileNumber: '', alternateNumber: '', emailAddress: '' } },
    purchaseDate: new Date(),
    consignmentCost: { id: 0, amount: 0, currency: Currency.INR },
    consignmentItem: [],
    invoiceNumber: 0,
  };

  selectedItem: any | null;
  items: any[] = [];
  amount: number | null;
  quantity: number | null;
  selectedVariation: Variation | null;
  @ViewChild('myForm') myForm: NgForm | undefined;
  @Input() consignmentItemData: StockConsignment;

  constructor(public modal: NgbActiveModal,
    private toyService: ToyService,
    private catalogService: CatalogService,
    private sonsignmentService: StockConsignmentService,
    private stockService: StockService,
    private el: ElementRef,
    private toster: ToasterService
  ) {
  }

  ngOnInit(): void {
    this.loadItem()

    if(this.consignmentItemData){
      this.consignment=this.consignmentItemData;
    }
  }

  loadItem() {
    this.catalogService.getCatalogList().subscribe(val=>{
      this.items = val;
    })
  }

  addNew() {
    if (this.selectedItem == undefined || this.selectedItem == null) {
      this.toster.showToast("Item can not be empty", ToastType.Warn, 2000)
      return
    }
    if (this.amount == undefined || this.amount == null) {
      this.toster.showToast("Amount can not be empty", ToastType.Warn, 2000)
      return
    }
    if (this.quantity == undefined || this.quantity == null) {
      this.toster.showToast("quantity can not be empty", ToastType.Warn, 2000)
      return
    }
    if( (this.selectedItem.variations.size >0) && (this.selectedVariation == undefined || this.selectedVariation == null) ) {
      this.toster.showToast("Please select variation", ToastType.Warn, 2000)
      return
    }
    const newItem = {
      itemId: this.selectedItem.id,
      itemName: this.selectedItem.name,
      purchasePrice: { amount: this.amount },
      quantity: this.quantity,
      variationId: this.selectedVariation.id
    };

    this.consignment.consignmentItem.push(newItem);
    this.selectedItem = null;
    this.amount = null;
    this.quantity = null;
    this.selectedVariation = null;
  }

  trackByFn(index: number, item: any): any {
    return item.id; // Assuming each item has a unique `id` property
}

  removeConsignment(index: number) {
    this.consignment.consignmentItem.splice(index, 1);
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement =
      this.el.nativeElement.querySelector("form .ng-invalid");

    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: "smooth",
    });
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  controlHasError(validation: string, control: NgModel): boolean {
    return control?.control?.hasError(validation) && (control.dirty || control.touched);
  }

  saveConsignment() {
    if (!this.myForm.valid) {
      const controls = this.myForm.controls;
      Object.keys(controls).forEach((controlName) => {
        controls[controlName].markAsTouched();
        this.scrollToFirstInvalidControl();
      });
    }
    else {
      if (this.consignment?.consignmentItem?.length == 0) {
        this.toster.showToast("Please select at least one consignment item", ToastType.Warn, 2000)
        return
      }
      console.log("consignment item saved: " + JSON.stringify(this.consignment))
      this.sonsignmentService.createStockConsignment(this.consignment).subscribe((res: any) => {
        this.modal.close()
      })
    }
  }

  updateConsignment(){
    this.sonsignmentService.updateStockConsignmentItem(this.consignment).subscribe((res: any) => {
      this.modal.close()
    })
  }

}
