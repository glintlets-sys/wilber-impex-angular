import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent {
  currentStep: number = 1;
  kidName: string = '';
  selectedGender: string = '';
  dateOfBirth: string = '';
  selectedCategory: string = '';

  nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  selectGender(gender: string): void {
    this.selectedGender = gender;
  }

  submitForm(): void {
    // You can perform any actions with the gathered customer information here
    console.log('Customer Information:');
    console.log('Kid Name:', this.kidName);
    console.log('Gender:', this.selectedGender);
    console.log('Date of Birth:', this.dateOfBirth);
    console.log('Selected Category:', this.selectedCategory);

    // Reset the form
    this.currentStep = 1;
    this.kidName = '';
    this.selectedGender = '';
    this.dateOfBirth = '';
    this.selectedCategory = '';
  }
}
