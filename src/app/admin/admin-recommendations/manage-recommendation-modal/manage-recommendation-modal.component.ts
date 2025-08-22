import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { ItemRecommendation, RecommendationType } from '../../../shared-services/item-recommendation';
import { ItemRecommendationService } from '../../../shared-services/item-recommendation.service';
import { ToyService } from '../../../shared-services/toy.service';
import { Toy } from '../../../shared-services/toy';

@Component({
  selector: 'app-manage-recommendation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-recommendation-modal.component.html',
  styleUrl: './manage-recommendation-modal.component.scss'
})
export class ManageRecommendationModalComponent implements OnInit {

  @Input() edit_recommended_item: ItemRecommendation;
  @Output() closePopup = new EventEmitter<void>();
  @Output() saveRecommendation = new EventEmitter<ItemRecommendation>();
  @ViewChild('myForm') myForm: NgForm;

  toys: Toy[] = [];
  toysPaginated: Toy[] = [];
  searchToy: string = '';
  selectedSourceId: number;
  recommendationTypes: RecommendationType[] = [RecommendationType.Similar, RecommendationType.Related];
  selectedToys: number[] = [];
  recommended_list: Toy[] = [];
  
  defaultItemRecommendation: ItemRecommendation = {
    sourceItemId: undefined,
    recommendedItemIds: [],
    recommendationType: "",
  };

  constructor(
    public toyService: ToyService,
    private recommendationService: ItemRecommendationService
  ) { }

  ngOnInit(): void {
    this.getToys();
    if (this.edit_recommended_item) {
      this.loadEditData();
    }
  }

  public getToys(): void {
    this.toyService.getAllToys().subscribe({
      next: (toys) => {
        this.toys = [...toys.filter(toy => toy.code !== null && toy.code !== undefined && toy.code !== "")];
        this.toysPaginated = [...this.toys];
        console.log('📦 [ManageRecommendationModal] Loaded toys:', this.toys.length);
      },
      error: (error) => {
        console.error('❌ [ManageRecommendationModal] Error loading toys:', error);
      }
    });
  }

  loadRecommedData(): void {
    this.filterRecommendTable();
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
      this.getToys();
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
      .subscribe({
        next: (val) => {
          this.recommended_list = [...val];
          this.loadRecommedData();
          console.log('📦 [ManageRecommendationModal] Loaded related items:', this.recommended_list);
        },
        error: (error) => {
          console.error('❌ [ManageRecommendationModal] Error loading related items:', error);
        }
      });
  }

  onChangeLoad(): void {
    this.edit_recommended_item = null;
    this.selectedToys = [];
    this.loadEditData();
  }

  filterData(): void {
    this.toysPaginated = this.toys.filter(toy =>
      toy?.name?.toLowerCase().includes(this.searchToy.toLowerCase()) || 
      toy?.brand?.toLowerCase().includes(this.searchToy.toLowerCase())
    );
    this.filterRecommendTable();
  }

  addSelectedToys(toy: Toy) {
    this.getToys();
    this.recommended_list.push(toy);
    this.selectedToys.push(toy.id);
    this.filterRecommendTable();
  }

  removeSelectedToys(toy: Toy) {
    this.getToys();
    const indexToRemove = this.recommended_list.findIndex(item => item.id === toy.id);
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
    // Filter out already recommended items
    this.toysPaginated = this.toysPaginated.filter(toyitem => 
      !this.recommended_list.some(recommenditem => recommenditem.id === toyitem.id)
    );
  }

  controlHasError(validation: string, control: NgModel): boolean {
    return control?.control?.hasError(validation) && (control.dirty || control.touched);
  }

  saveRecommendedItem() {
    if (!this.myForm.valid) {
      const controls = this.myForm.controls;
      Object.keys(controls).forEach((controlName) => {
        controls[controlName].markAsTouched();
      });
      return;
    }

    if (this.selectedToys?.length === 0) {
      alert("Please enter at least one recommend item");
      return;
    }

    this.defaultItemRecommendation.recommendedItemIds = this.selectedToys;
    
    this.recommendationService.updateOrAddRelatedItems(this.defaultItemRecommendation).subscribe({
      next: (val) => {
        console.log('✅ [ManageRecommendationModal] Recommendation saved successfully:', val);
        this.recommendationService.loadRecommendations();
        this.saveRecommendation.emit(val);
      },
      error: (error) => {
        console.error('❌ [ManageRecommendationModal] Error saving recommendation:', error);
        alert('Error saving recommendation. Please try again.');
      }
    });
  }

  onCancel(): void {
    this.closePopup.emit();
  }
}
