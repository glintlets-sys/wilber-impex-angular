import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToWords'
})
export class ConvertToWordsPipe implements PipeTransform {

  private units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  private teens = ['', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  private tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  transform(value: number): string {
    if (value === 0) {
      return 'Zero';
    }

    const amountInWords = this.convert(value);
    return amountInWords.charAt(0).toUpperCase() + amountInWords.slice(1);
  }

  private convert(value: number): string {
    if (value < 10) {
      return this.units[value];
    } else if (value < 20) {
      return this.teens[value - 10];
    } else if (value < 100) {
      return this.tens[Math.floor(value / 10)] + ' ' + this.units[value % 10];
    } else if (value < 1000) {
      return this.units[Math.floor(value / 100)] + ' Hundred ' + this.convert(value % 100);
    } else if (value < 1000000) {
      return this.convert(Math.floor(value / 1000)) + ' Thousand ' + this.convert(value % 1000);
    } else {
      return 'Number is too large to convert';
    }
  }
}
