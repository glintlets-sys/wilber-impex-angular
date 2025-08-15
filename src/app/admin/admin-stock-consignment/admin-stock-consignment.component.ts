import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../shared-services/toaster.service';
import { ToastType } from '../../shared-services/toaster';
import { StockConsignmentService } from '../../shared-services/stock-consignment.service';
import { StockService } from '../../shared-services/stock.service';
import { StockConsignment, Currency } from '../../shared-services/StockConsignment';
import { StockImportReviewComponent } from './stock-import-review/stock-import-review.component';
import * as XLSX from 'xlsx';

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
  selector: 'app-admin-stock-consignment',
  standalone: true,
  imports: [CommonModule, FormsModule, StockImportReviewComponent],
  templateUrl: './admin-stock-consignment.component.html',
  styleUrls: ['./admin-stock-consignment.component.scss']
})
export class AdminStockConsignmentComponent implements OnInit {
  public stockConsignments: StockConsignment[] = [];
  public filteredConsignments: StockConsignment[] = [];
  public searchConsignment: string = '';
  public loading: boolean = false;
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public Math = Math; // For use in template
  
  // Import review properties
  public showImportReview: boolean = false;
  public parsedConsignment: StockConsignment | null = null;
  public importFileName: string = '';
  
  // Computed properties for template
  public get pendingCount(): number {
    return this.stockConsignments.filter(c => !c.stockCreated).length;
  }
  
  public get activatedCount(): number {
    return this.stockConsignments.filter(c => c.stockCreated).length;
  }
  
  public get totalCount(): number {
    return this.stockConsignments.length;
  }

  constructor(
    private router: Router,
    private toasterService: ToasterService,
    private stockConsignmentService: StockConsignmentService,
    private stockService: StockService
  ) { }

  ngOnInit(): void {
    console.log('🔄 [StockConsignment] Component initialized');
    this.loadStockConsignments();
  }

  public loadStockConsignments(): void {
    console.log('🔄 [StockConsignment] Loading stock consignments...');
    this.loading = true;
    
    this.stockConsignmentService.getAllStockConsignments().subscribe({
      next: (consignments) => {
        console.log('🔄 [StockConsignment] Received consignments:', consignments);
        this.stockConsignments = consignments;
        this.filteredConsignments = [...this.stockConsignments];
        this.totalItems = this.filteredConsignments.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ [StockConsignment] Error loading consignments:', error);
        this.toasterService.showToast('Failed to load stock consignments', ToastType.Error);
        this.loading = false;
        // Fallback to empty array
        this.stockConsignments = [];
        this.filteredConsignments = [];
        this.totalItems = 0;
      }
    });
  }

  public filterData(): void {
    if (!this.searchConsignment.trim()) {
      this.filteredConsignments = [...this.stockConsignments];
    } else {
      this.filteredConsignments = this.stockConsignments.filter(consignment =>
        consignment.dealer?.dealerName?.toLowerCase().includes(this.searchConsignment.toLowerCase()) ||
        consignment.invoiceNumber?.toString().includes(this.searchConsignment)
      );
    }
    this.totalItems = this.filteredConsignments.length;
    this.currentPage = 1;
  }

  public get paginatedConsignments(): StockConsignment[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredConsignments.slice(startIndex, endIndex);
  }

  public get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
  }

  public addStockConsignment(): void {
    this.toasterService.showToast('Feature coming soon!', ToastType.Info);
  }

  public editStockConsignment(consignment: StockConsignment): void {
    if (consignment.stockCreated) {
      this.toasterService.showToast('Stock has already been created for this consignment', ToastType.Warn);
      return;
    }
    this.toasterService.showToast('Feature coming soon!', ToastType.Info);
  }

  public deleteStockConsignment(consignment: StockConsignment): void {
    if (consignment.stockCreated) {
      this.toasterService.showToast('Stock has already been created for this consignment', ToastType.Warn);
      return;
    }
    
    if (confirm('Are you sure you want to delete this consignment?')) {
      this.stockConsignmentService.deleteStockConsignment(consignment.id).subscribe({
        next: () => {
          this.toasterService.showToast('Consignment deleted successfully', ToastType.Success);
          this.loadStockConsignments(); // Reload the list
        },
        error: (error) => {
          console.error('❌ [StockConsignment] Error deleting consignment:', error);
          this.toasterService.showToast('Failed to delete consignment', ToastType.Error);
        }
      });
    }
  }

  public activateStock(consignment: StockConsignment): void {
    if (consignment.stockCreated) {
      this.toasterService.showToast('Stock has already been created for this consignment', ToastType.Warn);
      return;
    }
    
    // First generate stocks, then activate (same as backup)
    this.stockConsignmentService.generateStocks(consignment.id).subscribe({
      next: (generateStock: boolean) => {
        // If generateStocks returns true, proceed with activation
        if (generateStock === true) {
          console.log('✅ [StockConsignment] Stock generation successful, proceeding with activation');
          this.stockService.activateStock(consignment.id).subscribe({
            next: () => {
              this.toasterService.showToast('Stock activated successfully', ToastType.Success);
              this.loadStockConsignments(); // Reload the list to get updated status
            },
            error: (error) => {
              console.error('❌ [StockConsignment] Error activating stock:', error);
              this.toasterService.showToast('Failed to activate stock', ToastType.Error);
            }
          });
        } else {
          console.log('❌ [StockConsignment] Stock generation failed - received false from generateStocks');
          this.toasterService.showToast('Failed to generate stock', ToastType.Error);
        }
      },
      error: (error) => {
        console.error('❌ [StockConsignment] Error generating stock:', error);
        this.toasterService.showToast('Failed to generate stock', ToastType.Error);
      }
    });
  }

  public exportStock(): void {
    this.stockService.downloadExcelFile().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'stock-consignments.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        this.toasterService.showToast('Stock data exported successfully', ToastType.Success);
      },
      error: (error) => {
        console.error('❌ [StockConsignment] Error exporting stock:', error);
        this.toasterService.showToast('Failed to export stock data', ToastType.Error);
      }
    });
  }

  public importStock(): void {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx,.xls';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        // Check file extension
        if (file.name.indexOf(".") > -1) {
          var extension = file.name.split(".").pop().toLowerCase();
        } else {
          var extension = file.name.split("/").pop().toLowerCase();
        }

        if (["xls", "xlsx"].indexOf(extension) == -1) {
          this.toasterService.showToast("Please select a valid Excel file (.xls or .xlsx)", ToastType.Error);
          return;
        }

        this.importFileName = file.name;
        this.processExcelFile(file);
      }
      // Clean up
      document.body.removeChild(fileInput);
    };
    
    // Add to DOM and trigger click
    document.body.appendChild(fileInput);
    fileInput.click();
  }

  private processExcelFile(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      try {
        // Use exact same approach as backup
        let data = "";
        const bytes = new Uint8Array(e.target.result);
        for (let i = 0; i < bytes.byteLength; i++) {
          data += String.fromCharCode(bytes[i]);
        }
        
        this.processExcelData(data);
        
      } catch (error) {
        console.error('Error processing Excel file:', error);
        this.toasterService.showToast('Error processing Excel file', ToastType.Error);
      }
    };
    
    reader.onerror = () => {
      this.toasterService.showToast('Error reading file', ToastType.Error);
    };
    
    reader.readAsArrayBuffer(file);
  }

  private processExcelData(data: string): void {
    const workbook = XLSX.read(data, { type: 'binary' });
    const firstSheet = workbook.SheetNames[0];
    const excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
    
    console.log('🔄 [StockConsignment] Excel rows parsed:', excelRows);
    this.toasterService.showToast(`Successfully processed ${excelRows.length} rows from Excel file`, ToastType.Success);
    
    // Create a new stock consignment from Excel data
    const consignment: StockConsignment = {
      id: 0,
      dealer: {
        id: 0,
        dealerName: '',
        address: {
          id: 0,
          firstLine: '',
          secondLine: '',
          city: '',
          state: '',
          country: '',
          pincode: '',
          mobileNumber: '',
          alternateNumber: '',
          emailAddress: ''
        }
      },
      purchaseDate: new Date(),
      consignmentCost: { amount: 0, currency: Currency.INR },
      consignmentItem: []
    };

    // Process each row exactly like the backup implementation
    for (let i = 0; i < excelRows.length; i++) {
      const item = excelRows[i] as ExcelDataItem;
      const itemType = item["col3"];
      
      if (i === 0 || i === 10) {
        continue;
      }
      
      switch (itemType) {
        case "Dealer name":
          consignment.dealer.dealerName = item.col4 as string;
          break;
        case "Purchase date":
          const dateString = item.col4;
          if (dateString) {
            const [day, month, year] = dateString.split('/').map(Number);
            const temp: any = new Date(Date.UTC(year, month - 1, day));
            consignment.purchaseDate = temp;
          } else {
            consignment.purchaseDate = null;
          }
          break;
        case "City":
          consignment.dealer.address.city = item.col4 as string;
          break;
        case "State":
          consignment.dealer.address.state = item.col4 as string;
          break;
        case "Country":
          consignment.dealer.address.country = item.col4 as string;
          break;
        case "Pincode":
          consignment.dealer.address.pincode = item.col4?.toString() || '';
          break;
        case "Mobile Number":
          consignment.dealer.address.mobileNumber = item.col4?.toString() || '';
          break;
        case "Email Address":
          consignment.dealer.address.emailAddress = item.col4?.toString() || '';
          break;
        case "Consignment cost":
          consignment.consignmentCost.amount = item.col4 as number;
          break;
        case "Sno":
          break;
        default:
          if (item.col2) {
            if (item.col10 > 0) {
              consignment.consignmentItem.push({
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

    console.log('🔄 [StockConsignment] Final parsed consignment:', consignment);

    // Show the parsed data for review
    this.parsedConsignment = consignment;
    this.showImportReview = true;
  }

  public confirmImport(): void {
    if (!this.parsedConsignment) {
      this.toasterService.showToast('No data to import', ToastType.Error);
      return;
    }

    if (!this.parsedConsignment.dealer.dealerName || this.parsedConsignment.consignmentItem.length === 0) {
      this.toasterService.showToast('Invalid Excel format or missing required data', ToastType.Warn);
      return;
    }

    this.stockConsignmentService.createStockConsignment(this.parsedConsignment).subscribe({
      next: () => {
        this.toasterService.showToast('Stock consignment imported successfully', ToastType.Success);
        this.cancelImportReview();
        this.loadStockConsignments(); // Reload the list
      },
      error: (error) => {
        console.error('Error creating stock consignment:', error);
        this.toasterService.showToast('Failed to import stock consignment', ToastType.Error);
      }
    });
  }

  public cancelImportReview(): void {
    this.showImportReview = false;
    this.parsedConsignment = null;
    this.importFileName = '';
  }

  public getStatusBadgeClass(consignment: StockConsignment): string {
    return consignment.stockCreated ? 'badge-success' : 'badge-warning';
  }

  public getStatusText(consignment: StockConsignment): string {
    return consignment.stockCreated ? 'Activated' : 'Pending';
  }

  public formatCurrency(price: any): string {
    if (!price) return 'N/A';
    return `${price.currency || 'INR'} ${price.amount.toLocaleString()}`;
  }

  public formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN');
  }
}
