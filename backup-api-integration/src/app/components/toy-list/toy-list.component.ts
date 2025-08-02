import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToyService } from 'src/app/services/toy.service';
import { Toy, ProductDescription, CategoryDetails } from 'src/app/services/toy';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/services/category';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddToysModalComponent } from './add-toys-modal/add-toys-modal.component';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastType } from 'src/app/services/toaster';
import { ExcelComponent } from 'src/app/shared/excel/excel.component';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-toy-list',
  templateUrl: './toy-list.component.html',
  styleUrls: ['./toy-list.component.scss']
})
export class ToyListComponent implements OnInit {
  toys: Toy[] = [];
  selectedToy: any = undefined
  searchToy = ''
  allCategories: Category[] = [];
  editToyPop: boolean = false
  addToyPop: boolean = false
  editCategoryPop: boolean = false
  tableSize = environment.tableSize;
  page: number = 1;
  count: number = 0;
  toysPaginated: Toy[] = [];

  constructor(
    private categoryService: CategoryService,
    private authService: AuthenticationService,
    private toyService: ToyService,
    private waitService: LoadingOverlayService,
    private modalService: NgbModal,
    private toasterService: ToasterService) { }

  ngOnInit() {
    this.waitService.showLoadingOverlay("Loading", 30000);
    this.getToys();
  }

  getToys() {
    this.toyService.getAllToys().subscribe(val => {
      this.toys = val;

      this.updateFilters();
      if(!(this.allCategories.length > 0)){
        this.categoryService.getAllCategories().subscribe(categories => {
          this.allCategories = categories;
          this.populateCategoryNames();
          this.waitService.hideLoadingOverlay();
        });
      }
      
    });
  }

  updateFilters() {
    this.toys = this.toys.filter(toy => toy.code !== null && toy.code !== undefined && toy.code !== "");
    this.toysPaginated = this.toys;
    this.count = this.toysPaginated?.length;
  }

  updateToyCategoryDetail(toy: Toy) {
    if (toy.categories?.length) {
      toy.categoryDetails = toy.categories.map(categoryId => {
        const category = this.allCategories.find(cat => cat.id === categoryId);
        return category ? { id: categoryId, name: category.name } : null;
      }).filter(Boolean);
    }
  }

  populateCategoryNames() {
    this.toys.forEach(toy => {
      this.updateToyCategoryDetail(toy);
    });
  }

  loadImagesToCMS(){
    this.waitService.showLoadingOverlay("",60000);
    this.toyService.loadImagestoCMS().subscribe(val=>{
      this.waitService.hideLoadingOverlay();
    });
  }

  openAddPopupForToys(item: any) {
    const modalRef = this.modalService.open(AddToysModalComponent, {
      size: "xl",
    });

    if (item == "editToy") {
      this.editToyPop = true
      modalRef.componentInstance.editToyPopUp = this.editToyPop
      modalRef.componentInstance.editToyData = this.selectedToy
    }

    if (item == "editCat") {
      this.editCategoryPop = true
      modalRef.componentInstance.editCategoryPop = this.editCategoryPop
      modalRef.componentInstance.editCategoryData = this.selectedToy
    }

    if (item == "add") {
      this.addToyPop = true
      modalRef.componentInstance.addToyPop = this.addToyPop
    }
    modalRef.result.then(() => {
      if (this.searchToy) {
        this.filterData
      } else {
        this.getToys()
      }
    })

  }

  doTrueForEdit() {
    this.editToyPop = true
  }

  filterData(): void {
    this.toysPaginated = this.toys.filter(toy =>
      toy?.name?.toLowerCase().includes(this.searchToy) || toy?.brand?.toLowerCase().includes(this.searchToy)
    );
    this.count = this.toysPaginated?.length;
    this.page = 1;
  }

  generateThumb() {
    this.waitService.showLoadingOverlay("Loading", 10000);
    this.categoryService.updateThumbnail().subscribe(
      (res: any) => {
        this.waitService.hideLoadingOverlay();
      },
      (error: any) => {
        this.waitService.hideLoadingOverlay();
        console.error('Error generating thumbnail:', error);
      }
    );
  }

  isModalOpen = false;  // Flag to control modal visibility
  secret: string = '';  // Model to collect the secret

  openModal() {
    this.isModalOpen = true;
  }

  // Method to close the modal
  closeModal() {
    this.isModalOpen = false;
    this.secret = '';  // Reset secret when closing
  }

  // Method to confirm deletion
  confirmDelete() {
    if (this.authService.isUserAdmin()) {
      // Call the delete method with the secret
      this.toyService.deleteAllToys(this.secret).subscribe(() => {
        // Handle successful deletion
        console.log('All toys deleted successfully');
        this.closeModal();  // Close the modal after successful action
      }, error => {
        // Handle error
        console.error('Error deleting toys:', error);
      });
    }
  }

  deleteToy(id: number) {
    this.toyService.deleteToy(id).subscribe((res: any) => {
      this.updateFilters();
      this.toasterService.showToast("Item has been deleted", ToastType.Success, 3000);
    })
  }

  importExcelItme() {
    const modalRef = this.modalService.open(ExcelComponent, {
      size: "xl",
    });
  }

  exportExcelItems() {

    this.waitService.showLoadingOverlay("",60000);
     this.toyService.downloadExcelFile().subscribe(response => {
        // Handle the response to trigger the file download
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ItemDetails.xlsx'); // or any other filename
        document.body.appendChild(link);
        link.click();
        this.waitService.hideLoadingOverlay();
      });
    
  }

}
