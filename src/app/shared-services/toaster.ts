export enum ToastType {
    Info = 'info',
    Warn = 'warning',
    Error = 'danger',
    Success = 'success',
    None = 'dark'
  }
  
  export interface Toast {
    message: string;
    type: ToastType;
  }
  
