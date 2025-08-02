import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const SERVICE_URL = environment.serviceURL;
@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private apiUrl = SERVICE_URL +  'encrypt'; 

  constructor(private http: HttpClient) { }

  encryptData(data: string): Observable<string> {
    //const requestPayload = { ccRequest: data };
    return this.http.post<string>(this.apiUrl, data);
  }
}
