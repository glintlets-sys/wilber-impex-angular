//... other imports
import { Component, EventEmitter, Input, Output, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() filterElements: any[] = [];
  @Output() onFilter = new EventEmitter<any>();
  showFilters = false; // Will be true for large screens by default
  filterText = "SHOW FILTERS";
  dataArray: { [key: string]: any } = [];
  public someValue = 5
  public someRange: number[] = [3, 7];

  constructor() { }

  ngOnInit(): void {
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.filterText = "HIDE FILTERS";
    }
    else {
      this.filterText = "SHOW FILTERS";
    }
  }

  onInputChange(event: Event, option: string, categoryKey: string): void {
    const isChecked: boolean = (event.target as HTMLInputElement)?.checked;
    const existingKeyIndex = this.dataArray.findIndex(item => Object.keys(item)[0] === categoryKey);
    if (categoryKey == 'brand') {
      if (isChecked) {
        if (existingKeyIndex !== -1) {
          this.dataArray[existingKeyIndex][categoryKey].push(option);
        } else {
          this.dataArray.push({ [categoryKey]: [option] });
        }
      } else {
        if (existingKeyIndex !== -1) {
          this.dataArray[existingKeyIndex][categoryKey] = this.dataArray[existingKeyIndex][categoryKey].filter(filter => filter !== option);
          if (this.dataArray[existingKeyIndex][categoryKey].length === 0) {
            this.dataArray.splice(existingKeyIndex, 1);
          }
        }
      }
    }
    else {
      const element = this.filterElements.find(e => e.key === categoryKey);
      const existingKeyIndex = this.dataArray.findIndex(item => Object.keys(item)[0] === categoryKey);
      if (existingKeyIndex !== -1) {
        this.dataArray[existingKeyIndex][categoryKey][0] = { min: element.range[0], max: element.range[1] };
      } else {
        this.dataArray.push({ [categoryKey]: [{ min: element.range[0], max: element.range[1] }] });
      }
    }
    this.onFilter.emit(this.dataArray);
  }

  onChange(value: any) {
  }
  
}
