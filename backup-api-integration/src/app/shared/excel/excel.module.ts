import { NgModule } from '@angular/core';
import { ExcelComponent } from './excel.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        ExcelComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ExcelComponent
    ]
})
export class ExcelModule { }
