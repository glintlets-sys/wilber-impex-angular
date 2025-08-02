import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AwsImageService } from 'src/app/services/aws-image.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { ItemRatings } from 'src/app/services/item-ratings';
import { Rating } from 'src/app/services/rating';
import { RatingService } from 'src/app/services/rating-service.service';
import { ToastType } from 'src/app/services/toaster';
import { ToasterService } from 'src/app/services/toaster.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent implements OnInit, OnDestroy {

  routeSubscription: Subscription;
  itemId: any;
  item: any;
  itemRatings: ItemRatings;
  selectedRating: number = 0;
  review: Rating = new Rating(0, 0, '', 0, '', new Date());
  userName: string = '';
  file: any;
  selectedFiles: any[] = []
  imgList: any[] = []
  @ViewChild('fileInput') fileInput: any;

  constructor(private route: ActivatedRoute,
    private catalogService: CatalogService,
    private ratingService: RatingService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private toasterService: ToasterService,
    private awsImageService: AwsImageService,
  ) {

  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.itemId = params.get('productId');
      if (this.itemId) {
        this.getItem()
      }
    });

    this.userService.userName$.subscribe(val => {
      if (val != '') {
        this.userName = val
      } else {
        this.userName = localStorage.getItem('userName') ?? '';
      }
    })

  }

  getItem() {
    this.catalogService.getCatalogItem(this.itemId).subscribe((data) => {
      this.item = data
      this.ratingService.getItemRating(this.itemId).subscribe(val => {
        this.itemRatings = val;
      })
      this.ratingService.fetchItemRating(this.itemId);
    });
  }

  selectRating(rating: number) {
    this.selectedRating = rating;
    this.review.rating = rating;
  }

  onFileChange(event: any): any {
    this.file = event.target.files[0];
    if (this.file) {
      this.selectedFiles.push(this.file);
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (event: any) => {
        this.imgList.push({ src: event.target.result, file: this.file })
        this.cdr.detectChanges();
      }
    }
  }

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  removeImage(img?: any): void {
    if (img) {
      const index = this.imgList.findIndex((i) => i.src === img.src);
      if (index !== -1) {
        this.imgList.splice(index, 1);
        this.selectedFiles.splice(index, 1)
      }
    } else {
      this.review.imageUrls = [];
    }
  }

  async uploadImages(): Promise<void> {
    try {
      const uploadedImageUrls: string[] = [];
      await Promise.all(this.selectedFiles.map(async (file: any) => {
        const res: any = await this.awsImageService.uploadImage(file).toPromise();
        uploadedImageUrls.push(res.url);
      }));

      this.review.imageUrls = uploadedImageUrls;
    } catch (error) {
      this.toasterService.showToast("Something went wrong. Please retry", ToastType.Error, 3000);
    }
  }

  submitRatingAndComment() {
    let newRating: Rating = {
      id: -1,
      rating: this.selectedRating,
      comment: this.review.comment,
      toyId: this.itemId,
      user: this.userName,
      creationDate: new Date(),
      title: this.review.title,
    };
    if (newRating.rating == 0) {
      this.toasterService.showToast("Please rate this product", ToastType.Error, 3000);
      return
    }
    if (newRating.comment == '') {
      this.toasterService.showToast("Please write something about product on description", ToastType.Error, 3000);
      return
    }
    this.uploadImages().then(() => {
      newRating.imageUrls = this.review.imageUrls;
      this.ratingService.addRatingAndComment(newRating).subscribe(
        (response: Rating) => {
          this.toasterService.showToast('Rating and comment submitted successfully.', ToastType.Success, 3000);
          this.selectedRating = 0;
          this.review.comment = '';
          this.review.title = '';
          this.imgList = [];
          this.selectedFiles = [];
        },
        (error: any) => {
          this.toasterService.showToast('Error submitting rating and comment.', ToastType.Error, 3000);
        }
      );
    });
  }


  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

}
