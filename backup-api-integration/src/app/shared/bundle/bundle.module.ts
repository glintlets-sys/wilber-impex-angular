import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BundleComponent } from './bundle.component';
import { RouterModule } from '@angular/router';
import { BundleRoutingModule } from './bundle-routing.module';
import { CatalogItemModule } from 'src/app/components/catalog-item/catalog-item.module';

@NgModule({
    declarations: [
        BundleComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        BundleRoutingModule,
        CatalogItemModule
    ],
    exports: [
        BundleComponent
    ]
})
export class BundleModule { }
