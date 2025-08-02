import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemRecommendation, RecommendationType } from 'src/app/services/item-recommendation';
import { ItemRecommendationService } from 'src/app/services/item-recommendation.service';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { ToastType } from 'src/app/services/toaster';
import { ToasterService } from 'src/app/services/toaster.service';
import { Toy } from 'src/app/services/toy';
import { ToyService } from 'src/app/services/toy.service';
// import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-manage-recommended-modal',
  templateUrl: './manage-recommended-modal.component.html',
  styleUrls: ['./manage-recommended-modal.component.scss']
})
export class ManageRecommendedModalComponent implements OnInit {

  @Input() edit_recommended_item: ItemRecommendation;
  toys: Toy[] = [];
  toysPaginated: Toy[] = [];
  searchToy: string = '';
  selectedSourceId: number;
  recommendationTypes: RecommendationType[] = [RecommendationType.Similar, RecommendationType.Related];
  selectedToys: number[] = [];
  recommended_list: any[] = []
  defaultItemRecommendation: ItemRecommendation = {
    sourceItemId: undefined,
    recommendedItemIds: [],
    recommendationType: "",
  };

  @ViewChild('myForm') myForm: NgForm | undefined;

  constructor(
    public modal: NgbActiveModal, // Add NgbActiveModal to the constructor parameters
    public toyService: ToyService,
    private loadingService: LoadingOverlayService,
    private recommendationService: ItemRecommendationService,
    private toaster: ToasterService,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    this.getToys();
    if (this.edit_recommended_item) {
      this.loadEditData();
    }
  }

  public getToys(): void {
    this.loadingService.showLoadingOverlay("Loading", 5000);
    this.toyService.getAllToys().subscribe(toys => {
      this.toys = [...toys.filter(toy => toy.code !== null && toy.code !== undefined && toy.code !== "")];
      this.toysPaginated = [...this.toys];
      this.loadingService.hideLoadingOverlay();
    });
  }

  loadRecommedData(): void {
    this.filterRecommendTable()
    this.recommended_list.forEach(element => {
      this.selectedToys.push(element.id);
    });
  }

  loadEditData(): void {
    if (this.edit_recommended_item) {
      this.defaultItemRecommendation = {
        sourceItemId: this.edit_recommended_item.sourceItemId,
        recommendationType: this.edit_recommended_item.recommendationType
      };
    } else {
      this.getToys()
      const indexToRemove = this.toysPaginated.findIndex(item => item.id === this.defaultItemRecommendation.sourceItemId);
      if (indexToRemove !== -1) {
        this.toysPaginated.splice(indexToRemove, 1);
      }
      const recommendItem: any = this.defaultItemRecommendation;
      this.defaultItemRecommendation = {
        sourceItemId: recommendItem.sourceItemId != null ? recommendItem.sourceItemId : this.edit_recommended_item.sourceItemId,
        recommendationType: recommendItem.recommendationType != null ? recommendItem.recommendationType : this.edit_recommended_item.sourceItemId,
      };
    }

    this.recommended_list = [];
    this.recommendationService.getAllRelatedItems(this.defaultItemRecommendation.sourceItemId, this.defaultItemRecommendation.recommendationType)
      .subscribe(val => {
        this.recommended_list = [...val];
        this.loadRecommedData();
      });
  }

  onChangeLoad(): void {
    this.edit_recommended_item = null;
    this.selectedToys = []
    this.loadEditData();
  }

  filterData(): void {
    this.toysPaginated = this.toys.filter(toy =>
      toy?.name?.toLowerCase().includes(this.searchToy) || toy?.brand?.toLowerCase().includes(this.searchToy)
    );
    this.filterRecommendTable();
  }

  addSelectedToys(toy) {
    this.getToys()
    this.recommended_list.push(toy)
    this.selectedToys.push(toy.id)
    this.filterRecommendTable();
  }

  removeSelectedToys(toy) {
    this.getToys()
    const indexToRemove = this.recommended_list.findIndex(item => item.id === toy.id)
    if (indexToRemove !== -1) {
      this.recommended_list.splice(indexToRemove, 1);
      this.selectedToys.splice(indexToRemove, 1);
    }
    this.filterRecommendTable();
  }

  filterRecommendTable() {
    if (this.defaultItemRecommendation.sourceItemId) {
      const indexToRemove = this.toysPaginated.findIndex(item => item.id === this.defaultItemRecommendation.sourceItemId);
      if (indexToRemove !== -1) {
        this.toysPaginated.splice(indexToRemove, 1);
      }
    }
    //the logic is applied if the recommend list item is mathed then it will not stroe the recommend item list in the toy paginated array
    this.toysPaginated = this.toysPaginated.filter(toyitem => !this.recommended_list.some(recommenditem => recommenditem.id === toyitem.id));
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

  saveRecommendedItem() {
    if (!this.myForm.valid) {
      const controls = this.myForm.controls;
      Object.keys(controls).forEach((controlName) => {
        controls[controlName].markAsTouched();
        this.scrollToFirstInvalidControl();
      });
    }
    else {
      if (this.selectedToys?.length == 0) {
        this.toaster.showToast("Please enter at least one recommend item")
        return
      }
      this.defaultItemRecommendation.recommendedItemIds = this.selectedToys
      this.recommendationService.updateOrAddRelatedItems(this.defaultItemRecommendation).subscribe(val => {
        this.recommendationService.loadRecommendations()
        this.modal.close()
      });
    }
  }

}
