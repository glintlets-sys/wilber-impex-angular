import { Component, OnInit } from '@angular/core';
import { Stock, StockStatus } from 'src/app/services/stock';
import { StockService } from 'src/app/services/stock.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {
  public stocks: Stock[] = [];
  public itemQuantity: { [itemId: number]: number } = {};
  public lockedStockCount: number;
  public stockStatusConsolidation: { [status: string]: number };
  public itemStock = {};
  public itemStocksArr = [];
  searchStock: any = "";
  staticStock: any[] = [];
  tableSize = environment.tableSize;
  page: number = 1;
  count: number = 0;

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.loadStocks();
  }

  public convertKeyValueToArray(itemStock: any): any[] {
    let array = [];
    for (const key in itemStock) {
      if (itemStock.hasOwnProperty(key)) {
        array.push({ key: key, value: itemStock[key] });
      }
    }
    return array;
  }

  public getTotalStockCount() {
    return this.stocks.length;
  }

  public loadStocks(): void {
    this.stockService.getAllStocks().subscribe(
      (data: Stock[]) => {
        this.stocks = data;
        this.itemStocksArr = this.stockService.getItemStock(this.stocks);
        this.staticStock = [... this.itemStocksArr];
        this.count = this.staticStock?.length;
      },
      (error: any) => {
        console.log('Error loading stocks:', error);
      }
    );

  }

  getStockStatusName(status: StockStatus): string {
    switch (status) {
      case StockStatus.READY:
        return 'Ready';
      case StockStatus.ACTIVE:
        return 'Active';
      case StockStatus.ADDEDTOCART:
        return 'Added to Cart';
      case StockStatus.SOLD:
        return 'Sold';
      default:
        return '';
    }
  }

  public editStock(stock: Stock): void {
    // Handle editing logic
  }

  public deleteStock(stockId: number): void {
    // Handle deletion logic
  }

  filterData(): void {
    this.itemStocksArr = this.staticStock.filter(stock =>
      stock?.name?.toLowerCase().includes(this.searchStock) || stock?.brand?.toLowerCase().includes(this.searchStock)
    );

    this.count = this.itemStocksArr?.length
    this.page = 1;

  }

}
