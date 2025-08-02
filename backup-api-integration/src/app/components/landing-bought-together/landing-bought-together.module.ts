import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LandingBoughtTogetherComponent } from './landing-bought-together.component';

@NgModule({
    declarations: [
        LandingBoughtTogetherComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    exports: [
        LandingBoughtTogetherComponent
    ]
})
export class LandingBoughtTogetherModule { }
