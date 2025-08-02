import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoughtTogether } from 'src/app/services/boughtTogether/bought-together';
import { BoughtTogetherService } from 'src/app/services/boughtTogetherService/bought-together.service';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { ToastType } from 'src/app/services/toaster';
import { ToasterService } from 'src/app/services/toaster.service';
import { Toy } from 'src/app/services/toy';
import { ToyService } from 'src/app/services/toy.service';

@Component({
  selector: 'app-addtoysbought',
  templateUrl: './addtoysbought.component.html',
  styleUrls: ['./addtoysbought.component.scss']
})
export class AddtoysboughtComponent implements OnInit {

  @Input() editBoughtTogetherData: BoughtTogether;
  boughtTogether: BoughtTogether = {
    id: 0,
    items: [],
    discountPercent: 0,
    creationDate: new Date()
  };
  @ViewChild('myForm') myForm: NgForm | undefined;
  toysPaginated: Toy[] = [];
  bought_together_list: any[] = [];
  toys: Toy[] = [];
  searchToy: string = '';
  selectedToys: number[] = [];
  loadEditDataForBoolean: boolean = true;

  constructor(public modal: NgbActiveModal,
    private el: ElementRef,
    public toyService: ToyService,
    private loadingService: LoadingOverlayService,
    private toaster: ToasterService,
    private boughtTogetherService: BoughtTogetherService
  ) { }

  ngOnInit(): void {
    this.getToys();
    if (this.editBoughtTogetherData) {
      this.boughtTogether = {
        ...this.editBoughtTogetherData,
        creationDate: new Date(this.editBoughtTogetherData.creationDate)
      };
    }
  }

  getToys() {
    this.loadingService.showLoadingOverlay("Loading", 5000);
    this.toyService.getAllToys().subscribe(toys => {
      this.toys = [...toys.filter(toy => toy.code !== null && toy.code !== undefined && toy.code !== "")];
      this.toysPaginated = [...this.toys];
      this.loadingService.hideLoadingOverlay();
      if (this.editBoughtTogetherData && this.loadEditDataForBoolean) {
        this.loadEditData();
      }
    });
  }

  loadEditData() {
    this.bought_together_list = this.editBoughtTogetherData.items;
    this.filterBoughtTogether()
  }

  filterBoughtTogether() {
    //the logic is applied if the recommend list item is mathed then it will not stroe the recommend item list in the toy paginated array
    this.toysPaginated = this.toysPaginated.filter(toyitem => !this.bought_together_list.some(boughtItem => boughtItem.itemId == toyitem.id));
  }

  filterData() {
    this.toysPaginated = this.toys.filter(toy =>
      toy?.name?.toLowerCase().includes(this.searchToy) || toy?.brand?.toLowerCase().includes(this.searchToy)
    );
    this.filterBoughtTogether();
  }

  addBoughtTogetherItems(toy) {
    if (this.bought_together_list?.length == 2) {
      this.toaster.showToast("Sorry the max limit is reached", ToastType.Warn, 2000)
      return;
    }
    if (this.bought_together_list?.length < 3) {
      this.getToys()
      this.bought_together_list.push({ itemId: toy.id, itemName: toy.name, brand: toy.brand, imageUrl: toy.thumbnail })
      this.filterBoughtTogether();
    }
  }

  removeBoughtTogetherItems(toy) {
    this.loadEditDataForBoolean = false
    this.getToys()
    const indexToRemove = this.bought_together_list.findIndex(item => item.itemId == toy.itemId)
    if (indexToRemove !== -1) {
      this.bought_together_list.splice(indexToRemove, 1);
    }
    this.filterBoughtTogether();
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement =
      this.el.nativeElement.querySelector("form .ng-invalid");

    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: "smooth",
    });
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  controlHasError(validation: string, control: NgModel): boolean {
    return control?.control?.hasError(validation) && (control.dirty || control.touched);
  }

  saveBoughtTogetherItem() {
    if (!this.myForm.valid) {
      const controls = this.myForm.controls;
      Object.keys(controls).forEach((controlName) => {
        controls[controlName].markAsTouched();
        this.scrollToFirstInvalidControl();
      });
    }
    else {
      if (this.bought_together_list?.length == 0) {
        this.toaster.showToast("Please enter at least one recommend item")
        return
      }
      if (this.editBoughtTogetherData) {
        this.boughtTogetherService.updateBoughtTogether(this.editBoughtTogetherData.id, this.boughtTogether).subscribe(val => {
          this.modalCloseAndClearCache();
        })
      } else {
        this.boughtTogether.items = this.bought_together_list;
        this.boughtTogetherService.createBoughtTogether(this.boughtTogether).subscribe(val => {
          this.modalCloseAndClearCache();
        });
      }
    }

  }

  modalCloseAndClearCache() {
    this.modal.close()
    this.boughtTogetherService.clearCache()
  }

}
