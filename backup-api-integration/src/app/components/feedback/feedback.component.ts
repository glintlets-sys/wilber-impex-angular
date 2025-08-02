import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Feedback } from 'src/app/services/feedback';
import { FeedbackService } from 'src/app/services/feedback.service';
import { ToastType } from 'src/app/services/toaster';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  focus = false;
  focus1 = false;
  focus2 = false;
  focus3 = false;
  currentRoute: string;

  constructor(private activatedRoute: ActivatedRoute,
    private feedbackService: FeedbackService,
    private toaster: ToasterService, private router: Router) { }

  ngOnInit(): void {
    // Subscribe to the ActivatedRoute url observable
    this.activatedRoute.url.subscribe(url => {
      this.currentRoute = url.join('/');
    });
  }

  submitForm() {
    const feedback: Feedback = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      message: this.message
    };

    this.feedbackService.submitFeedback(feedback)
      .subscribe(
        (response) => {
          this.toaster.showToast("Thanks for your feedback!",ToastType.Success,3000)
          console.log('Feedback submitted successfully!', response);
          // Reset form fields after successful submission
          this.firstName = '';
          this.lastName = '';
          this.email = '';
          this.message = '';
          this.navigateToHome();
        },
        (error) => {
          console.error('Error submitting feedback:', error);
          // Handle error scenario
        }
      );
  }


  private navigateToHome() {
    this.router.navigate(['/home']);
  }
}
