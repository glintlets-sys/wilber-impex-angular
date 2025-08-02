// aws-image-list.component.ts
import { Component, OnInit } from '@angular/core';
import { AwsImage, AwsImageService } from 'src/app/services/aws-image.service';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { ToasterService } from 'src/app/services/toaster.service';


@Component({
  selector: 'app-aws-image-list',
  templateUrl: './aws-image-list.component.html',
  styleUrls: ['./aws-image-list.component.scss']
})
export class AwsImageListComponent implements OnInit {
  public images: AwsImage[] = [];
  public totalItems: number = 0;
  public currentPage: number = 0;
  public pageSize: number = 10;
  public totalPages: number;

  constructor(private awsImageService: AwsImageService, private toasterService: ToasterService, private loadingService: LoadingOverlayService) { }

  ngOnInit() {
    this.loadImages();
  }


  loadImages(): void {
    this.awsImageService.getAllImages(this.currentPage, this.pageSize)
      .subscribe(imagePage => {
        console.log("response: " + JSON.stringify(imagePage));
        this.images = imagePage.content;
        this.totalItems = imagePage.totalElements;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadImages();
  }

  selectedFile: File;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
  uploadImage() {
    this.loadingService.showLoadingOverlay("uploading image .. ", 5000);
    this.awsImageService.uploadImage(this.selectedFile).subscribe(response => {
      console.log(response);
      this.loadingService.hideLoadingOverlay();
      this.loadImages();
      this.selectedFile = undefined;

    });
  }
  
  deleteImage(imageId: number) {
    this.awsImageService.deleteImage(imageId).subscribe(() => {
      this.loadImages();
    });
  }
}
