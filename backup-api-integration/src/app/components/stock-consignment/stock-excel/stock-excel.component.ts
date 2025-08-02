import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/services/toaster.service';
import * as XLSX from 'xlsx';
import * as $ from "jquery";
import { ToastType } from 'src/app/services/toaster';
import { Currency, StockConsignment } from 'src/app/services/StockConsignment';
import { ToyService } from 'src/app/services/toy.service';
import { StockConsignmentService } from 'src/app/services/consignment.service';
import { StockService } from 'src/app/services/stock.service';
import { NgForm, NgModel } from '@angular/forms';

interface ExcelDataItem {
  "Stock Management ": string;
  "col4"?: string | number | any;
  "__EMPTY": number;
  "col2": number;
  "col3"?: string;
  "col5"?: number;
  "__EMPTY_4"?: number;
  "__EMPTY_5"?: number;
  "col8"?: number;
  "col9"?: number;
  "col10"?: number;
  "col11"?: number;
}

@Component({
  selector: 'app-stock-excel',
  templateUrl: './stock-excel.component.html',
  styleUrls: ['./stock-excel.component.scss']
})
export class StockExcelComponent implements OnInit {
  file: any;
  SelectedFileImport: boolean = true;
  resetFileforImport: boolean = true;
  importFileforReset: boolean = false;
  openAccordion: boolean = false;
  NewExcelRows = [];
  @ViewChild("excelUpload") _ExcelUpload!: ElementRef;
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
  @ViewChild('myForm') myForm: NgForm | undefined;

  constructor(public modal: NgbActiveModal, private toaster: ToasterService, private toyService: ToyService,
    private consignment_service: StockConsignmentService, private stockService: StockService, private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.loadItem()
  }

  SelectFile(event) {
    this.file = event.target?.files[0];
    this.SelectedFileImport = false;
  }

  importFile() {
    if (this.file) {
      if (this.file.name.indexOf(".") > -1) {
        var extension = this.file.name.split(".").pop().toLowerCase();
      } else {
        var extension = this.file.name.split("/").pop().toLowerCase();
      }

      if ($.inArray(extension, ["xls", "xlsx"]) == -1) {
        this._ExcelUpload.nativeElement.value = null;
        this.toaster.showToast("Please enter the requried field", ToastType.Error, 3000);
        this.importFileforReset = false;
      } else {
        this.NewExcelRows = [];
        this.resetFileforImport = false;
        this.openAccordion = true;
        this.importFileforReset = true;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          let data = "";
          const bytes = new Uint8Array(e.target.result);
          for (let i = 0; i < bytes.byteLength; i++) {
            data += String.fromCharCode(bytes[i]);
          }
          this.ProcessExcel(data);
        };
        reader.readAsArrayBuffer(this.file);
      }
    }

  }

  ProcessExcel(data: string): void {
    const workbook = XLSX.read(data, { type: 'binary' });
    const firstSheet = workbook.SheetNames[0];
    const excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
    for (let i = 0; i < excelRows.length; i++) {
      const item = excelRows[i] as ExcelDataItem;
      const itemType = item["col3"];
      if (i === 0 || i === 10) {
        continue;
      }
      switch (itemType) {
        case "Dealer name":
          this.consignment.dealer.dealerName = item.col4 as string;
          break;
        case "Purchase date":
          const dateString = item.col4;

          if (dateString) {
            const [day, month, year] = dateString.split('/').map(Number);
            const temp: any = new Date(Date.UTC(year, month - 1, day));
            this.consignment.purchaseDate = temp.toISOString().split('T')[0] || null;
          } else {
            this.consignment.purchaseDate = null;
          }

          break;
        case "City":
          this.consignment.dealer.address.city = item.col4 as string;
          break;
        case "State":
          this.consignment.dealer.address.state = item.col4 as string;
          break;
        case "Country":
          this.consignment.dealer.address.country = item.col4 as string;
          break;
        case "Pincode":
          this.consignment.dealer.address.pincode = item.col4?.toString() || '';
          break;
        case "Mobile Number":
          this.consignment.dealer.address.mobileNumber = item.col4?.toString() || '';
          break;
        case "Email Address":
          this.consignment.dealer.address.emailAddress = item.col4?.toString() || '';
          break;
        case "Consignment cost":
          this.consignment.consignmentCost.amount = item.col4 as number;
          break;
        case "Sno":
          break;
        default:
          if (item.col2) {
            if (item.col10 > 0) {
              this.consignment.consignmentItem.push({
                itemId: item.col2,
                itemName: item.col3,
                quantity: item.col10 || 0,
                purchasePrice: {
                  amount: item.col11 as number,
                  currency: Currency.INR,
                },
                variationId: item.col5 as number
              });
            }
          }
          break;
      }
    }
  }

  resetFile() {
    this.resetFileforImport = true;
    this.importFileforReset = false;
    this.openAccordion = false;
  }

  loadItem() {
    this.toyService.getAllToys().subscribe(toys => {
      this.items = toys
    });
  }

  addNew() {
    if (this.selectedItem == undefined || this.selectedItem == null) {
      this.toaster.showToast("Item can not be empty", ToastType.Warn, 2000)
      return
    }
    if (this.amount == undefined || this.amount == null) {
      this.toaster.showToast("Amount can not be empty", ToastType.Warn, 2000)
      return
    }
    if (this.quantity == undefined || this.quantity == null) {
      this.toaster.showToast("quantity can not be empty", ToastType.Warn, 2000)
      return
    }
    const newItem = {
      itemId: this.selectedItem.id,
      itemName: this.selectedItem.name,
      purchasePrice: { amount: this.amount },
      quantity: this.quantity
    };

    this.consignment.consignmentItem.push(newItem);
    this.selectedItem = null;
    this.amount = null;
    this.quantity = null;
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

  submitItemImport() {
    if (!this.myForm.valid) {
      const controls = this.myForm.controls;
      Object.keys(controls).forEach((controlName) => {
        controls[controlName].markAsTouched();
        this.scrollToFirstInvalidControl();
      });
    }
    else {
      if (this.consignment?.consignmentItem?.length == 0) {
        this.toaster.showToast("Please select at least one consignment item", ToastType.Warn, 2000)
        return
      }
      this.consignment_service.createStockConsignment(this.consignment).subscribe((res: any) => {
        this.modal.close()
      })
    }
  }

}
