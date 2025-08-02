import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { error } from 'console';
import * as $ from "jquery";
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { ToastType } from 'src/app/services/toaster';
import { ToasterService } from 'src/app/services/toaster.service';
import { StockType, Toy } from 'src/app/services/toy';
import { ToyService } from 'src/app/services/toy.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.scss']
})
export class ExcelComponent {
  file: any;
  SelectedFileImport: boolean = true;
  @ViewChild("excelUpload") _ExcelUpload!: ElementRef;
  SelectedZipFile: any;
  NewExcelRows = [];
  importFileforReset: boolean = false;
  SelectedFile: any;
  resetFileforImport: boolean = true;
  openAccordion: boolean = false;
  incIndex: number = 0;
  display_status: boolean = false
  constructor(public modal: NgbActiveModal, private waitService: LoadingOverlayService,
    private toyService: ToyService,
    private toaster: ToasterService,) { }

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
          this.ProcessExcelNew(data);
        };
        reader.readAsArrayBuffer(this.file);
      }
    }

  }

 
  ProcessExcelNew(data: string): void {
    const workbook = XLSX.read(data, { type: 'binary' });
    const firstSheet = workbook.SheetNames[0];
    const excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
    let i = 0;

    const headers: any = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1 })[0];


    excelRows.forEach((Row: any, rowIndex: number) => {
      if (Row.code !== undefined) {

        const tableData: { [key: string]: any } = {};

        // Assuming the first row (rowIndex 0) is the header row
       // const headerRow = excelRows[0] as Record<string, any>;
        //const headers = Object.keys(headerRow);
        
        const startingColNumber = 31; // Column number from where dynamic fields start
    
        // Loop through the columns starting from the specified column number
        headers.forEach((key, colIndex) => {
          if (colIndex >= startingColNumber) {
            const headerKey = headers[colIndex];
            const value = Row[key]; // Get the value from the current row
            tableData[headerKey] = value; // Set the key-value pair in tableData
          }
        });

        const newRow: Toy = {
          id: Row.id, 
          name: Row.name,
          code: Row.code,
          hsn: Row.hsn,
          brand: Row.brand,
          tax: Row.tax,
          summary: Row.summary,
          price: { amount: Row.price, currency: Row.currency },
          food: Row.food=='FALSE'?false:true,
          veg: Row.veg=='FALSE'?false:true,
          units: Row.units,
          discount: { id: 0, discountPercent: Row.discountPercent, version: 0 },
          photoLinks: Row.photoLinks?Row.photoLinks.split('\n'):[],
          thumbnail: Row.thumbnail,
          videoLinks: Row.VideoImg ? Row.VideoImg.split('\n') : [],
          productDescription: [{ heading: Row.productDescription_heading, text: Row.productDescription_text, pictureUrl: Row.productDescription_pictureUrl }],
          variations: [{id: -1, color: Row.variation_color, size: Row.variation_size }],
          stockType: Row.stockType === "Flexible"?StockType.Flexible:StockType.Managed,
          notAvailable: true,
          length: Row.Length,
          breadth: Row.Breadth,
          height: Row.Height,
          sizeUOM: Row.sizeUOM,
          weight: Row.Weight,
          weightUOM: Row.weightWOM,
          keywords: Row.keywords,
          tableData: JSON.stringify(tableData),
          categories: Row.categories?.split(",").map(Number)
          
        };
  
        this.NewExcelRows.push(newRow);
      } else {
        const lengthOfExcel = this.NewExcelRows?.length;
        if (Row.productDescription_heading !== undefined && Row.productDescription_text !== undefined) {
          this.NewExcelRows[lengthOfExcel - 1].productDescription.push({ heading: Row.productDescription_heading, text: Row.productDescription_text, pictureUrl: Row.productDescription_pictureUrl });
        }
        if (Row.variation_color !== undefined && Row.variation_size !== undefined) {
          this.NewExcelRows[lengthOfExcel - 1].variations.push({ id: -1, color: Row.variation_color, size: Row.variation_size });
        }
      }
    });
  }

  ProcessExcel(data: string): void {
    const workbook = XLSX.read(data, { type: 'binary' });
    const firstSheet = workbook.SheetNames[0];
    const excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
    let i = 0;
    
    excelRows.forEach((Row: any) => {
      if (Row.Code !== undefined) {
        const newRow: Toy = {
          id: i++, 
          name: Row.Name,
          code: Row.Code,
          price: { amount: Row.Price, currency: 'INR' },
          tax: Row.Tax,
          productDescription: [{ heading: Row.DescriptionTitle, text: Row.DescriptionText, pictureUrl: '' }],
          videoLinks: Row.VideoImg ? [Row.VideoImg] : [],
          photoLinks: [Row.ImgUrl],
          brand: Row.brand,
          kidsAge: undefined,
          discount: { id: 0, discountPercent: 0, version: 0 }
        };
  
        this.NewExcelRows.push(newRow);
      } else {
        const lengthOfExcel = this.NewExcelRows?.length;
        if (Row.DescriptionTitle !== undefined && Row.DescriptionText !== undefined) {
          this.NewExcelRows[lengthOfExcel - 1].productDescription.push({
            heading: Row.DescriptionTitle,
            text: Row.DescriptionText
          });
        }
        if (Row.ImgUrl !== undefined) {
          this.NewExcelRows[lengthOfExcel - 1].photoLinks.push(Row.ImgUrl);
        }
      }
    });
  }

  resetFile() {
    this.resetFileforImport = true;
    this.importFileforReset = false;
    this.openAccordion = false;
  }

  importing = false;

  submitItemImport() {
    this.display_status = true;
    if (this.incIndex < this.NewExcelRows?.length) {
      this.importing = true;
      this.createOrUpdateItemFromExcel();
    }
    if (this.incIndex == this.NewExcelRows?.length) {
      this.importing = false;
      this.modal.close()
    }
  }

  createOrUpdateItemFromExcel() {
   
  
    if ((this.NewExcelRows[this.incIndex].id == null) || (this.NewExcelRows[this.incIndex].id == undefined) || this.NewExcelRows[this.incIndex].id <= 0) {
      console.log("Create the item. Item id:  " + this.NewExcelRows[this.incIndex].id);
      if (this.NewExcelRows[this.incIndex].photoLinks != undefined) {
        this.NewExcelRows[this.incIndex].thumbnail = this.NewExcelRows[this.incIndex].photoLinks[0]
      }
      this.NewExcelRows[this.incIndex].id = -1;

      this.toyService.createToy(this.NewExcelRows[this.incIndex]).subscribe({
        next: (toy) => {
          if (toy) {
            this.NewExcelRows[this.incIndex].status = "success";
            this.incIndex += 1;
            this.submitItemImport();
          }
        },
        error: (error) => {
          this.NewExcelRows[this.incIndex].status = "failed";
          this.incIndex += 1;
          this.submitItemImport();
        }
      });
    }
    else {
     
        console.log("Updating the item. Item id:  " + this.NewExcelRows[this.incIndex].id);
        this.toyService.updateToy(this.NewExcelRows[this.incIndex]).subscribe({
          next: (toy) => {
            if (toy) {
              this.NewExcelRows[this.incIndex].status = "success";
              this.incIndex += 1;
              this.submitItemImport();
            }
          },
          error: (error) => {
            this.NewExcelRows[this.incIndex].status = "failed";
            this.incIndex += 1;
            this.submitItemImport();
          }
        });
     
    }
  }

  createNewToy() {
    this.toyService.createToy(this.NewExcelRows[this.incIndex]).subscribe({
      next: (toy) => {
        if (toy) {
          this.NewExcelRows[this.incIndex].status = "success";
          this.incIndex += 1;
          this.submitItemImport();
        }
      },
      error: (error) => {
        this.NewExcelRows[this.incIndex].status = "failed";
        this.incIndex += 1;
        this.submitItemImport();
      }
    });
  }

}
