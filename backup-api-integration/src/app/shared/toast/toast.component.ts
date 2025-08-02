import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/services/toaster.service';
import { Toast } from 'src/app/services/toaster';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']

})
export class ToastComponent implements OnInit {
  toast: Toast | null = null;


  isMobile: boolean;

  constructor(private toasterService: ToasterService) { 
    
  }

  ngOnInit(): void {
    this.toasterService.toast$.subscribe((toast: Toast | null) => {
      this.isMobile = window.innerWidth < 768; //
      this.toast = toast;
    });
  }
  dismissToast() {
    this.toast = null;
  }
}
