import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConsignmentItem, StockConsignment } from 'src/app/services/StockConsignment';
import { StockConsignmentService } from 'src/app/services/stock-consignment.service';
import { AddEditConsignmentComponent } from './add-edit-consignment/add-edit-consignment.component';
import { StockService } from 'src/app/services/stock.service';
import { Stock } from 'src/app/services/stock';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { StockExcelComponent } from './stock-excel/stock-excel.component';
import { environment } from 'src/environments/environment';
import { CatalogService } from 'src/app/services/catalog.service';
@Component({
  selector: 'app-stock-consignment',
  templateUrl: './stock-consignment.component.html',
  styleUrls: ['./stock-consignment.component.scss']
})
export class StockConsignmentComponent implements OnInit {
  public stockConsignments: StockConsignment[] = [];
  public editedStockConsignment: StockConsignment = this.getNewStockConsignment();
  public editMode: boolean = false;
  searchConsignment: any = '';
  staticConsignment: any[] = [];

  tableSize = environment.tableSize;
  page: number = 1;
  count: number = 0;

  constructor(private stockConsignmentService: StockConsignmentService,
    private catalogService: CatalogService,
    private modalService: NgbModal,
    private stock_service: StockService) { }

  ngOnInit() {
    this.fetchStockConsignments();
  }

  public fetchStockConsignments() {
    this.stockConsignmentService.getAllStockConsignments().subscribe((consignments: StockConsignment[]) => {
      this.stockConsignments = consignments;
      this.staticConsignment = consignments
      this.count = this.stockConsignments?.length
    });
  }

  public editStockConsignment(stockConsignment: StockConsignment): void {
    this.editMode = true;
    this.editedStockConsignment = { ...stockConsignment };
  }

  public addConsignmentItem() {
    // Create a new consignment item and add it to the edited stock consignment
    const newItem: ConsignmentItem = {
      id: null,
      itemId: null,
      purchasePrice: {
        id: null,
        amount: null,
        currency: null
      },
      margin: null,
      shippingCost: {
        id: null,
        amount: null,
        currency: null
      },
      quantity: null
      // Add other fields here
    };
    this.editedStockConsignment.consignmentItem.push(newItem);
  }

  public saveStockConsignment(): void {
    // Save the edited stockConsignment using the stockConsignmentService
    this.stockConsignmentService.updateStockConsignment(this.editedStockConsignment).subscribe(() => {
      this.editMode = false;
      this.fetchStockConsignments();
    });
  }

  public cancelEdit(): void {
    this.editMode = false;
    this.editedStockConsignment = this.getNewStockConsignment();
  }

  public deleteStockConsignment(stockConsignmentId: number): void {
    this.stockConsignmentService.deleteStockConsignment(stockConsignmentId).subscribe(() => {
      this.fetchStockConsignments();
    });
  }

  public createNewStockConsignment() {
    this.editedStockConsignment = this.getNewStockConsignment();
    this.editMode = true;
  }
  public getNewStockConsignment(): StockConsignment {
    const newStockConsignment: StockConsignment = {
      id: null,
      dealer: {
        id: null,
        dealerName: '',
        address: null
      },
      purchaseDate: null,
      consignmentCost: {
        id: null,
        amount: null,
        currency: null
      },
      consignmentItem: [],
      invoiceImage: null,
      shippingCost: {
        id: null,
        amount: null,
        currency: null
      },
      stockCreated: false,
      stockCreatedOn: null
    };

    return newStockConsignment;
  }

  addStockConsignment(consignment) {
    const modalRef = this.modalService.open(AddEditConsignmentComponent, {
      size: "xl",
    });

    if (consignment) {
      modalRef.componentInstance.consignmentItemData = consignment
    }

    modalRef.result.then(() => {
      this.fetchStockConsignments()
    })
  }

  filterData() {
    this.stockConsignments = this.staticConsignment.filter(consign =>
      consign.dealer.dealerName.toLowerCase().includes(this.searchConsignment.toLowerCase())
    );

    this.count = this.stockConsignments?.length;
    this.page = 1;

  }

  stocks: Stock[] = [];
  itemStocksArr: any[] = [];
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';

  exportStock() {
    this.stock_service.downloadExcelFile().subscribe(response => {
      // Handle the response to trigger the file download
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'StockDetails.xlsx'); // or any other filename
      document.body.appendChild(link);
      link.click();
    });
  }

  readAndModifyExcel(): void {
    const excelPath = 'assets/excel/GlintStockManagement.xlsx';
    // Make an HTTP request to get the Excel file as a blob
    fetch(excelPath).then((response) => response.blob()).then((blob) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const binaryString: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });

        // Modify the workbook data as needed
        this.modifyWorkbook(workbook);
      };

      reader.readAsBinaryString(blob);
    });
  }

  modifyWorkbook(workbook: XLSX.WorkBook): void {
    const firstSheetName = workbook.SheetNames[0];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

    // Assuming this.itemStocksArr is an array of objects with properties matching Excel columns
    this.itemStocksArr.forEach((item, index) => {
      const rowIndex = index + 2; // Assuming data starts from the second row (1-indexed)
      // Set data in corresponding columns
      worksheet[`A${rowIndex}`] = { t: 's', v: item.Sno }; // Assuming Sno is a string
      worksheet[`B${rowIndex}`] = { t: 'n', v: item['Item id'] }; // Assuming Item id is a number
      worksheet[`C${rowIndex}`] = { t: 's', v: item['Item Name'] };
      // ... Repeat for other columns

      // Update Purchase date
      const purchaseDateCell = worksheet[`C${rowIndex}`];
      if (purchaseDateCell && purchaseDateCell.t === 's' && purchaseDateCell.v === 'Purchase date') {
        const purchaseDateColumn = XLSX.utils.encode_cell({ r: rowIndex - 1, c: 2 }); // Assuming Purchase date is in column C
        worksheet[purchaseDateColumn] = { t: 's', v: item['Purchase date'] }; // Assuming Purchase date is a string
      }
    });

    // Save the modified workbook as a new Excel file
    const modifiedExcelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([modifiedExcelBuffer], { type: 'application/octet-stream' });
    // return;
    FileSaver.saveAs(data, 'modified_glint.xlsx');
  }


  importStock() {
    const modalRef = this.modalService.open(StockExcelComponent, {
      size: "xl",
    });

    modalRef.result.then(() => {
      this.fetchStockConsignments()
    })
  }

  activateStock(consignmentId) {
    this.stockConsignmentService.generateStocks(consignmentId).subscribe((generateStock: any) => {
      if (generateStock) {
        this.stock_service.activateStock(consignmentId).subscribe(activateStock => {
          this.fetchStockConsignments();
        })
      }
    })
  }

}
