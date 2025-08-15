import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockConsignment, Currency } from '../../../shared-services/StockConsignment';

@Component({
  selector: 'app-stock-import-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-import-review.component.html',
  styleUrls: ['./stock-import-review.component.scss']
})
export class StockImportReviewComponent implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() parsedConsignment: StockConsignment | null = null;
  @Input() importFileName: string = '';
  
  @Output() confirmImport = new EventEmitter<void>();
  @Output() cancelImport = new EventEmitter<void>();

  // Form validation properties
  public isEditing: boolean = false;
  public validationErrors: { [key: string]: string } = {};

  constructor() {
    // Ensure validationErrors is always initialized
    this.validationErrors = {};
  }

  // Mandatory fields
  private readonly mandatoryFields = [
    'dealerName',
    'consignmentItems'
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showModal'] && changes['showModal'].currentValue) {
      console.log('🔄 [ImportReview] Modal opened');
      console.log('🔄 [ImportReview] Import filename:', this.importFileName);
      console.log('🔄 [ImportReview] Parsed consignment:', this.parsedConsignment);
    }
    
    if (changes['parsedConsignment'] && changes['parsedConsignment'].currentValue) {
      console.log('🔄 [ImportReview] Parsed consignment updated:', this.parsedConsignment);
    }
  }

  public formatCurrency(price: any): string {
    if (!price) return 'N/A';
    return `${price.currency || 'INR'} ${price.amount.toLocaleString()}`;
  }

  public formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN');
  }

  public onConfirm(): void {
    if (this.validateData()) {
      // Set purchase date to current date if not already set
      if (!this.parsedConsignment?.purchaseDate) {
        this.parsedConsignment!.purchaseDate = new Date();
      }
      this.confirmImport.emit();
    }
  }

  public onCancel(): void {
    this.cancelImport.emit();
  }

  public toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.validationErrors = {};
    }
  }

  public validateData(): boolean {
    // Always ensure validationErrors is initialized
    if (!this.validationErrors) {
      this.validationErrors = {};
    }

    if (!this.parsedConsignment) {
      this.validationErrors.general = 'No data to validate';
      return false;
    }

    // Validate dealer name
    if (!this.parsedConsignment.dealer?.dealerName?.trim()) {
      this.validationErrors.dealerName = 'Consignment name is required';
    }



    // Validate consignment items
    if (!this.parsedConsignment.consignmentItem || this.parsedConsignment.consignmentItem.length === 0) {
      this.validationErrors.consignmentItems = 'At least one consignment item is required';
    } else {
      // Validate each item
      this.parsedConsignment.consignmentItem.forEach((item, index) => {
        if (!item.itemName?.trim()) {
          this.validationErrors[`itemName_${index}`] = 'Item name is required';
        }
        if (!item.quantity || item.quantity <= 0) {
          this.validationErrors[`quantity_${index}`] = 'Quantity must be greater than 0';
        }
        if (!item.purchasePrice?.amount || item.purchasePrice.amount <= 0) {
          this.validationErrors[`purchasePrice_${index}`] = 'Purchase price must be greater than 0';
        }
      });
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  public isDataValid(): boolean {
    return this.validateData();
  }

  public hasError(fieldName: string): boolean {
    return !!(this.validationErrors && this.validationErrors[fieldName]);
  }

  public getError(fieldName: string): string {
    return (this.validationErrors && this.validationErrors[fieldName]) || '';
  }

  public get hasValidationErrors(): boolean {
    return this.validationErrors && Object.keys(this.validationErrors).length > 0;
  }

  public updateField(field: string, value: any): void {
    if (!this.parsedConsignment) return;

    switch (field) {
      case 'dealerName':
        if (this.parsedConsignment.dealer) {
          this.parsedConsignment.dealer.dealerName = value;
        }
        break;
      case 'purchaseDate':
        this.parsedConsignment.purchaseDate = value;
        break;
      case 'city':
        if (this.parsedConsignment.dealer?.address) {
          this.parsedConsignment.dealer.address.city = value;
        }
        break;
      case 'state':
        if (this.parsedConsignment.dealer?.address) {
          this.parsedConsignment.dealer.address.state = value;
        }
        break;
      case 'country':
        if (this.parsedConsignment.dealer?.address) {
          this.parsedConsignment.dealer.address.country = value;
        }
        break;
      case 'pincode':
        if (this.parsedConsignment.dealer?.address) {
          this.parsedConsignment.dealer.address.pincode = value;
        }
        break;
      case 'mobileNumber':
        if (this.parsedConsignment.dealer?.address) {
          this.parsedConsignment.dealer.address.mobileNumber = value;
        }
        break;
      case 'emailAddress':
        if (this.parsedConsignment.dealer?.address) {
          this.parsedConsignment.dealer.address.emailAddress = value;
        }
        break;
      case 'consignmentCost':
        if (this.parsedConsignment.consignmentCost) {
          this.parsedConsignment.consignmentCost.amount = parseFloat(value) || 0;
        }
        break;
    }

    // Clear validation error for this field
    if (this.validationErrors[field]) {
      delete this.validationErrors[field];
    }
  }

  public updateItemField(itemIndex: number, field: string, value: any): void {
    if (!this.parsedConsignment?.consignmentItem?.[itemIndex]) return;

    const item = this.parsedConsignment.consignmentItem[itemIndex];

    switch (field) {
      case 'itemName':
        item.itemName = value;
        break;
      case 'quantity':
        item.quantity = parseInt(value) || 0;
        break;
      case 'purchasePrice':
        if (item.purchasePrice) {
          item.purchasePrice.amount = parseFloat(value) || 0;
        }
        break;
    }

    // Clear validation error for this field
    const errorKey = `${field}_${itemIndex}`;
    if (this.validationErrors[errorKey]) {
      delete this.validationErrors[errorKey];
    }
  }

  public removeItem(index: number): void {
    if (this.parsedConsignment?.consignmentItem) {
      this.parsedConsignment.consignmentItem.splice(index, 1);
    }
  }

  public addItem(): void {
    if (!this.parsedConsignment) return;

    if (!this.parsedConsignment.consignmentItem) {
      this.parsedConsignment.consignmentItem = [];
    }

    this.parsedConsignment.consignmentItem.push({
      itemId: 0,
      itemName: '',
      quantity: 0,
      purchasePrice: {
        amount: 0,
        currency: Currency.INR
      },
      variationId: 0
    });
  }
}
