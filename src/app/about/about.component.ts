import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initializeVideoControls();
    this.initializeCounters();
  }

  private initializeVideoControls(): void {
    const video = document.getElementById('delayedVideo') as HTMLVideoElement | null;
    const toggleAudio = document.getElementById('toggleAudio') as HTMLButtonElement | null;

    if (video && toggleAudio) {
      const icon = toggleAudio.querySelector('i');

      // Ensure video starts muted
      video.muted = true;

      // Pause the video immediately after it starts
      video.pause();

      // Ensure video plays after 2.5 seconds
      setTimeout(() => {
        video.play().catch(error => console.log("Autoplay blocked:", error));
      }, 2500);

      // Toggle mute/unmute on button click
      toggleAudio.addEventListener('click', () => {
        if (video.muted) {
          video.muted = false;
          video.play(); // Required for some browsers
          if (icon) {
            icon.className = 'fas fa-volume-up';
          }
        } else {
          video.muted = true;
          if (icon) {
            icon.className = 'fas fa-volume-mute';
          }
        }
        console.log("Muted:", video.muted);
      });
    }
  }

  private initializeCounters(): void {
    const counters = document.querySelectorAll('.count');
    counters.forEach(counter => {
      const updateCount = () => {
        const targetAttr = (counter as HTMLElement).getAttribute('data-target');
        const target = targetAttr ? +targetAttr : 0;
        const count = +(counter as HTMLElement).innerText || 0;
        const increment = target / 100;
        
        if (count < target) {
          (counter as HTMLElement).innerText = Math.ceil(count + increment).toString();
          setTimeout(updateCount, 30);
        } else {
          (counter as HTMLElement).innerText = target.toString();
        }
      };
      updateCount();
    });
  }
}
