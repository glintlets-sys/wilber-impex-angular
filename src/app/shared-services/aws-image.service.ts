import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

const SERVICE_URL = environment.serviceURL;

@Injectable({
  providedIn: 'root'
})
export class AwsImageService {
  apiUrl = SERVICE_URL + 'api/images'; // Update with your API endpoint

  constructor(private http: HttpClient) { }

  getAllImages(page: number, size: number): Observable<Page<AwsImage>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<AwsImage>>(this.apiUrl, { params });
  }
  
   deleteImage(imageId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${imageId}`);
  }
 


  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}

// aws-image.model.ts
export interface AwsImage {
  id: number;
  url: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}
