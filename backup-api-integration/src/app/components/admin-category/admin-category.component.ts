import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/services/category';
import { CategoryService } from 'src/app/services/category.service';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss'],
})
export class AdminCategoryComponent implements OnInit {
  categories: Category[];
  searchCat: any = ""
  staticProduct: any[] = []
  selectedCategoryData: any
  editCatPop: boolean = false
  someRange: any = 5
  tableSize = environment.tableSize;
  page: number = 1;
  count: number = 0;

  constructor(private categoryService: CategoryService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loadCategories()
  }

  loadCategories() {
    this.categoryService.categories$.subscribe(val => {
      this.categories = val;
      this.staticProduct = this.categories
      this.count = this.staticProduct?.length;
    })
  }

  getCategoryName(id: number): string {
    const category = this.categories.find(c => c.id === id);
    return category ? category.name : 'Unknown';
  }

  //@Deprecated
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: any) => {
        this.categories = categories;
        this.staticProduct = categories
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      },
      complete: () => { }
    })
  }

  filterData(): void {
    if (this.searchCat === "") {
      // this.getAllCategories();
      this.loadCategories()
    }
    else {
      var tempProduct: any
      tempProduct = this.staticProduct.filter(cat =>
        cat.name.toLowerCase().includes(this.searchCat.toLowerCase())
      );
      this.categories = tempProduct
    }

    this.count = this.categories?.length;
    this.page = 1;

  }

  openAddEditPopupForTCat(category) {
    const modalRef = this.modalService.open(AddEditCategoryComponent, {
      size: "xl",
    });
    if (category.id > 0) {
      modalRef.componentInstance.editCategoryData = category;
    }
    modalRef.result.then(() => {
      this.loadCategories();
    })
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe((res: any) => {
      this.getAllCategories()
    })
  }

}
