import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-paint-remover-250',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './paint-remover-250.component.html',
  styleUrl: './paint-remover-250.component.scss'
})
export class PaintRemover250Component {
  quantity: number = 1;
  activeInfo: string = '';
  selectedPackaging: string = 'single';
  productPrice: number = 750;
  showMoreDescription: boolean = false;

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  toggleProductInfo(type: string) {
    this.activeInfo = this.activeInfo === type ? '' : type;
  }

  toggleReadMore() {
    this.showMoreDescription = !this.showMoreDescription;
  }

  updatePrice() {
    if (this.selectedPackaging === 'single') {
      this.productPrice = 750;
    } else if (this.selectedPackaging === 'multi') {
      this.productPrice = 4200;
    }
  }
}
