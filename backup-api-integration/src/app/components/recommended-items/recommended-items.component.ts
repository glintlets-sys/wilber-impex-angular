import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToyService } from 'src/app/services/toy.service';
import { Toy, ProductDescription, CategoryDetails } from 'src/app/services/toy';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/services/category';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageRecommendedModalComponent } from './manage-recommended-modal/manage-recommended-modal.component';
import { ItemRecommendationService } from 'src/app/services/item-recommendation.service';
import { ItemRecommendation } from 'src/app/services/item-recommendation';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-recommended-items',
  templateUrl: './recommended-items.component.html',
  styleUrls: ['./recommended-items.component.scss']
})
export class RecommendedItemsComponent implements OnInit {
  public itemRecommendations: ItemRecommendation[] = [];
  public selectedItem: ItemRecommendation = null;
  editRecPop: boolean = false
  tableSize = environment.tableSize;
  page: number = 1;
  count: number = 0;

  constructor(
    private recommendationService: ItemRecommendationService,
    private toyService: ToyService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.loadRecommendedItem()
  }

  loadRecommendedItem() {
    this.recommendationService.getAllRecommendations().subscribe((val: ItemRecommendation[]) => {
      this.itemRecommendations = val;
      this.count = this.itemRecommendations?.length;
    })
    this.recommendationService.loadRecommendations();
  }

  getItemName(id: number) {
    return this.toyService.getToyByIdNonObj(id)?.name;
  }

  getItemImg(id: number) {
    return this.toyService.getToyByIdNonObj(id)?.thumbnail;
  }

  addEditRecommendItem(itemRecommendation) {
    const modalRef = this.modalService.open(ManageRecommendedModalComponent, {
      size: "xl",
    });

    modalRef.componentInstance.edit_recommended_item = itemRecommendation;

    modalRef?.result.then(() => {
      this.editRecPop = false
      this.loadRecommendedItem()
    })

  }

  deleteRecommend(recommendId) {
    this.recommendationService.deleteRecommendItem(recommendId).subscribe(() => {
      this.loadRecommendedItem()
    })
  }

}

