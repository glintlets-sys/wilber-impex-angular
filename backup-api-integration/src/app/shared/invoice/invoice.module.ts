import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { ConvertToWordsPipe } from 'src/app/services/convert-to-words.pipe';

@NgModule({

    imports: [
        CommonModule,
        RouterModule,
        InvoiceRoutingModule
    ],
    declarations: [
        InvoiceComponent,
        ConvertToWordsPipe
    ],
    exports: [
        InvoiceComponent
    ]
})
export class InvoiceModule { }
