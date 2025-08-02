import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Toast, ToastType } from './toaster';

@Injectable()
export class ToasterService {
  private toastSubject: BehaviorSubject<Toast | null> = new BehaviorSubject<Toast | null>(null);
  toast$: Observable<Toast | null> = this.toastSubject.asObservable();

  constructor() { }

  showToast(message: string, type: ToastType = ToastType.None, duration: number = 3000): void {
    const toast: Toast = { message, type };
    this.toastSubject.next(toast);

    if (duration > 0) {
      timer(duration).subscribe(() => {
        this.clearToast();
      });
    }
  }

  clearToast(): void {
    this.toastSubject.next(null);
  }
} 