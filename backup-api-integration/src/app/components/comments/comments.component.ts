import { Component, Input, OnInit } from '@angular/core';
import { Rating } from 'src/app/services/rating';
import { RatingService } from 'src/app/services/rating-service.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit{


  focus6: any;
  focus7: any;
  focus8: any;
  focus9: any;
  successMessage: string;

  @Input()
  toyId: number;


  ratings: Rating[] = []; // Assuming comments are strings
  rating: number = 0;


  formData: {
    name: string;
    email: string;
    comment: string;
  } = {
    name: '',
    email: '',
    comment: ''
  };


  selectedRating: number =0;

  constructor(private ratingService: RatingService) {
  }
  
  
  ngOnInit(): void {
    if(this.toyId) {
      this.fetchCommentsByToyId(this.toyId);
    }
    
  }

  

  submitRatingAndComment() {
    
    let newRating : Rating = {
      id: -1,
      rating: this.selectedRating, // Set the rating based on user input
      comment: this.formData.comment,
      toyId: this.toyId, // You can set this from your input field
      user: this.formData.name, // You can set this from your input field
      creationDate: undefined};

    this.ratingService.addRatingAndComment(newRating).subscribe(
      (response: Rating) => {
        this.successMessage = 'Rating and comment submitted successfully.';
        // Call a method to fetch comments for the specific toyId after submission
        this.fetchCommentsByToyId(this.toyId);
        this.rating = response.rating; // Assuming 'rating' is a property of your component
       
      },
      (error: any) => {
        // Handle error if submission fails
        this.successMessage = 'Error submitting rating and comment.';
      }
    );
  }
  
  fetchCommentsByToyId(toyId: number) {
    this.ratingService.getCommentsByToyId(toyId).subscribe(
      (ratings) => {
        this.ratings = ratings;
        this.ratingService.fetchItemRating(toyId);
      },
      (error) => {
        // Handle error if fetching comments fails
        this.successMessage = 'Error fetching comments.';
      }
    );
  }

  selectRating(rating: number) {
    // Function to track selected rating
    this.selectedRating = rating;
  }

}
