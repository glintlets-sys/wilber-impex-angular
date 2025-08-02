// sort.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sortData',
})
export class SortDataPipe implements PipeTransform {
    transform(items: any[], sortBy: string): any[] {
        if (!items || !sortBy) {
            return items;
        }

        return items.sort((a, b) => {
            if (sortBy === 'min') {
                return a.price.amount - b.price.amount;
            } else if (sortBy === 'max') {
                return b.price.amount - a.price.amount;
            } else {
                return 0;
            }
        });
    }
}
