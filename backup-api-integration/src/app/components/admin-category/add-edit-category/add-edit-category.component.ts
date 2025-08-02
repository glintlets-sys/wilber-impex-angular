import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/services/category';
import { CategoryService } from 'src/app/services/category.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastType } from 'src/app/services/toaster';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { AwsImageService } from 'src/app/services/aws-image.service';
import { concatMap } from 'rxjs/operators';
@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss']
})
export class AddEditCategoryComponent implements OnInit {
  @Input() editCategoryData: any
  public categories: Category = { id: 0, name: '', image: "assets/icons/no_image.svg", description: '', type: '' };
  @ViewChild('fileInput') fileInput: any;
  file: any;
  @Output() closePopup: EventEmitter<any> = new EventEmitter(false);
  categoriesArray: Category[]
  allCategories: Category[];

  categoryTypes: string[] = ["None", "Standard", "Featured", "Festive"];

  constructor(public modal: NgbActiveModal,
    private _catService: CategoryService,
    private toaster: ToasterService,
    private cdr: ChangeDetectorRef,
    private awsImageService: AwsImageService) {
  }

  ngOnInit(): void {
    if (this.editCategoryData != undefined) {
      this.categories = this.editCategoryData
    }

    this._catService.categories$.subscribe(val => {
      this.allCategories = val;
    })

  }

  onFileChange(event: any): any {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (event: any) => {
      this.categories.image = event.target.result
      this.cdr.detectChanges();
    }
  }

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  removeImage() {
    this.categories.image = "assets/icons/no_image.svg"
  }

  async uploadImage() {
    try {
      if (this.file == undefined) {
        return
      }
      else {
        const res: any = await this.awsImageService.uploadImage(this.file).toPromise();
        this.categories.image = res.url;
        this.file = undefined;
      }
    } catch (error) {
      this.toaster.showToast("Something went wrong. Please retry ", ToastType.Error, 3000);
    }
  }

  getAllCategories() {
    this._catService.getAllCategories().subscribe({
      next: (categories: any) => {
        this.categoriesArray = categories;
        this._catService.categoriesShowcaseSubject.next(this.categoriesArray)
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      },
      complete: () => { }
    })
  }

  saveCategory() {
    this.uploadImage().then(() => {
      if (this.editCategoryData == undefined) {
        this._catService.createCategory(this.categories).subscribe(val => {
          this._catService.loadCategories();
          this.modal.close();
        });
      } else {
        this._catService.updateCategory(this.categories).subscribe(val => {
          this._catService.loadCategories();
          this.modal.close();
        });
      }
    });
  }

}
