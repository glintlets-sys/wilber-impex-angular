import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AwsImageService } from 'src/app/services/aws-image.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/services/category';
import { DiscountService } from 'src/app/services/discount.service';
import { ToastType } from 'src/app/services/toaster';
import { ToasterService } from 'src/app/services/toaster.service';
import { ProductDescription, StockType, Toy } from 'src/app/services/toy';
import { ToyService } from 'src/app/services/toy.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-add-toys-modal',
  templateUrl: './add-toys-modal.component.html',
  styleUrls: ['./add-toys-modal.component.scss']
})
export class AddToysModalComponent implements OnInit {
  @Input() editToyPopUp: any;
  @Input() editToyData: any;
  @Input() editCategoryPop: any;
  @Input() editCategoryData: any;
  @Input() addToyPop: any;

  public supercategory: boolean = true;
  public category: boolean = false;
  public subCategory: boolean = false;

  toy: Toy = {
    id: 0,
    name: '',
    code: '',
    price: { amount: 0, currency: 'INR' },
    brand: '',
    kidsAge: undefined,
    photoLinks: [],
    videoLinks: [],
    productDescription: [],
    discount: { id: 0, discountPercent: 0, version: 0 },
    stockType: StockType.Managed,
    notAvailable: true
  };

  allCategories: any;
  selectedSuperCategoryId: number;
  selectedCategoryId: number;
  selectedSubCategoryId: number;

  @ViewChild('fileInput') fileInput: any;
  file: any;
  newProductHeading: string = '';
  newProductText: string = '';
  newProductPictureUrl: string = '';
  selectedFiles: any[] = []

  superCategories: Category[] = [];
  subCategories: Category[] = [];
  subSubCategories: Category[] = [];
  safeSrc: SafeResourceUrl;
  video_list: any[] = [];

  constructor(public modal: NgbActiveModal,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private toyService: ToyService,
    private awsImageService: AwsImageService,
    private toaster: ToasterService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    if (this.editCategoryPop) {
      this.getCategories();
    }
    if (this.editToyData) {
      this.loadToyData();
    }
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.allCategories = categories;
      this.superCategories = this.allCategories.filter(cat => cat.parentId === null)
    });
  }

  onCategoryChange(superCatId: number) {
    this.subCategories = this.allCategories.filter(supCategoryId => supCategoryId.parentId == superCatId)
    this.subSubCategories = []
  }

  onSubCategoryChange(CatId: number) {
    this.subSubCategories = this.allCategories.filter(subCatId => subCatId.parentId == CatId)
  }

  loadToyData() {
    this.toy = this.editToyData;
    if (!this.toy.discount) {
      this.toy.discount = {
        id: 0,
        discountPercent: 0,
        version: 0
      }
    }

    if (!this.editToyData) {
      this.toy.discount = {
        id: 0,
        discountPercent: 0,
        version: 0
      }
    }
    if (this.editToyData?.videoLinks.length > 0) {
      this.editToyData.videoLinks.forEach(element => {
        this.generateYoutubeLink(element)
      });
    }
  }

  generateYoutubeLink(item: any) {
    const videoId = this.extractVideoIdFromLink(item);
    const safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
    this.video_list.push({
      originalLink: item,
      embedLink: safeSrc
    });
  }

  public addVideoLink() {
    if (this.toy.videoLinks != undefined) {
      this.generateYoutubeLink(this.toy.videoLinks)
    }
  }

  private extractVideoIdFromLink(link: any): string {
    const match = link.match(/(?:youtu\.be\/|youtube\.com\/(?:.*\/(?:v\/|e\/|u\/\w+\/|embed\/|v\/)?|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : '';
  }

  public removeVideoLink(index: number) {
    this.video_list.splice(index, 1);
  }

  addCategory() {
    let catId = undefined;
    if (!this.selectedSuperCategoryId) {
      this.toaster.showToast("Please add a category")
      return
    }

    if (this.selectedSuperCategoryId) {
      catId = this.selectedSuperCategoryId;
    }
    if (this.selectedCategoryId) {
      catId = this.selectedCategoryId;
    }
    if (this.selectedSubCategoryId) {
      catId = this.selectedSubCategoryId;
    }

    const isCategoryAdded = !!this.editCategoryData?.categoryDetails?.some(category => category.id == catId);
    if (isCategoryAdded) {
      this.toaster.showToast("Category is already added")
      return
    }
    if (catId && !isCategoryAdded) {
      const categoriesToAdd = [catId];
      this.categoryService.addCategoriesToToy(this.editCategoryData.id, categoriesToAdd).subscribe(updatedToy => {
        this.updateToyCategoryDetail(updatedToy);
      });

      this.selectedSubCategoryId = undefined
      this.selectedCategoryId = undefined
      this.selectedSuperCategoryId = undefined
      this.subCategories = []
      this.subSubCategories = []
    }
  }

  updateToyCategoryDetail(toy: Toy) {
    if (toy.categories?.length) {
      if (!this.editCategoryData) {
        this.editCategoryData = {} as Toy;
      }
      this.editCategoryData.categoryDetails = toy.categories
        .map(toyCategoryId => this.allCategories.find(category => category.id === toyCategoryId))
        .filter(category => !!category) // Remove null values

    }
  }

  removeCategory(category: any, index: number) {
    const categoryIdToRemove = this.editCategoryData.categoryDetails[index].id;
    this.categoryService.deleteCategoryFromToy(this.editCategoryData.id, categoryIdToRemove).subscribe(updatedToy => {
      this.updateToyCategoryDetail(updatedToy);
    });
  }

  public addPhotoLink() {
    this.editCategoryData.photoLinks.push();
  }

  removePhotoLink(index: number) {
    this.toy.photoLinks.splice(index, 1);
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.splice(index, 1)
    }
    if (this.imgList.length > 0) {
      this.imgList.splice(index, 1)
    }
  }

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  imgList: any[] = []
  onFileChange(event: any): any {
    this.file = event.target.files[0];
    if (this.file) {
      this.selectedFiles.push(this.file);
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (event: any) => {
        this.imgList.push(event.target.result)
        this.cdr.detectChanges();
      }
    }
  }

  addNewProduct() {

    if (!this.newProductHeading) {
      this.toaster.showToast("Please enter product title")
      return
    }

    if (!this.newProductText) {
      this.toaster.showToast("Please enter product description")
      return
    }

    if (this.newProductHeading != '' && this.newProductText != '') {
      const newProduct: ProductDescription = {
        heading: this.newProductHeading,
        text: this.newProductText,
        pictureUrl: this.newProductPictureUrl,
      };
      this.toy.productDescription.push(newProduct);
      this.newProductHeading = '';
      this.newProductText = '';
      // this.newProductPictureUrl = '';
    }

  }

  public removeProductDescription(index: number) {
    this.toy.productDescription.splice(index, 1);
  }

  async uploadImages(): Promise<void> {
    try {
      const uploadedImageUrls: string[] = [];
      for (const file of this.selectedFiles) {
        const res: any = await this.awsImageService.uploadImage(file).toPromise();
        this.toy.photoLinks.push(res.url);
      }
    } catch (error) {
      this.toaster.showToast("Something went wrong. Please retry", ToastType.Error, 3000);
    }
  }

  saveToy() {

    if (!this.toy.name) {
      this.toaster.showToast("Please enter toy name")
      return
    }
    this.toy.videoLinks = this.video_list.map(video => video.embedLink.changingThisBreaksApplicationSecurity);
    if (this.selectedFiles.length > 0) {
      this.uploadImages().then(() => {
        if (this.addToyPop) {
          this.toyService.createToy(this.toy).subscribe((toy) => {
            this.refreshToyList();
          });
        } else {
          this.toyService.updateToy(this.toy).subscribe((val) => {
            this.refreshToyList();
          });
        }
      });
    } else {
      if (this.addToyPop) {
        this.toyService.createToy(this.toy).subscribe((toy) => {
          this.refreshToyList();
        });
      } else {
        this.toyService.updateToy(this.toy).subscribe((val) => {
          this.refreshToyList();
        });
      }
    }
  }

  refreshToyList() {
    this.toyService.refreshToys().subscribe(() => {
      this.modal.close();
    });
  }

}
