import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemRecommendationService } from '../../shared-services/item-recommendation.service';
import { ItemRecommendation } from '../../shared-services/item-recommendation';
import { ToyService } from '../../shared-services/toy.service';
import { ManageRecommendationModalComponent } from './manage-recommendation-modal/manage-recommendation-modal.component';

@Component({
  selector: 'app-admin-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule, ManageRecommendationModalComponent],
  templateUrl: './admin-recommendations.component.html',
  styleUrl: './admin-recommendations.component.scss'
})
export class AdminRecommendationsComponent implements OnInit {
  public itemRecommendations: ItemRecommendation[] = [];
  public selectedItem: ItemRecommendation = null;
  editRecPop: boolean = false;
  tableSize = 10;
  page: number = 1;
  count: number = 0;
  isLoading: boolean = true; // Add loading state

  constructor(
    private recommendationService: ItemRecommendationService,
    private toyService: ToyService
  ) { }

  ngOnInit() {
    this.loadRecommendedItem();
  }

  loadRecommendedItem() {
    this.isLoading = true; // Set loading to true when starting
    this.recommendationService.getAllRecommendations().subscribe((val: ItemRecommendation[]) => {
      this.itemRecommendations = val || [];
      this.count = this.itemRecommendations.length;
      this.isLoading = false; // Set loading to false when data is received
      console.log('📦 [AdminRecommendations] Loaded recommendations:', this.itemRecommendations);
      console.log('📦 [AdminRecommendations] Count:', this.count);
    });
    this.recommendationService.loadRecommendations();
  }

  getItemName(id: number): string {
    const toy = this.toyService.getToyByIdNonObj(id);
    return toy?.name || 'Unknown Product';
  }

  getItemImg(id: number): string {
    const toy = this.toyService.getToyByIdNonObj(id);
    return toy?.thumbnail || 'assets/images/image_empty.jpg';
  }

  // Modal states
  showRecommendationModal = false;
  selectedRecommendation: ItemRecommendation = null;

  addEditRecommendItem(itemRecommendation?: ItemRecommendation) {
    this.selectedRecommendation = itemRecommendation;
    this.showRecommendationModal = true;
  }

  closeRecommendationModal(): void {
    this.showRecommendationModal = false;
    this.selectedRecommendation = null;
  }

  onSaveRecommendation(recommendation: ItemRecommendation): void {
    console.log('✅ [AdminRecommendations] Recommendation saved:', recommendation);
    this.closeRecommendationModal();
    this.loadRecommendedItem();
  }

  deleteRecommend(recommendId: number) {
    if (confirm('Are you sure you want to delete this recommendation?')) {
      this.recommendationService.deleteRecommendItem(recommendId).subscribe({
        next: () => {
          console.log('✅ [AdminRecommendations] Recommendation deleted successfully');
          this.loadRecommendedItem();
        },
        error: (error) => {
          console.error('❌ [AdminRecommendations] Error deleting recommendation:', error);
        }
      });
    }
  }
}
