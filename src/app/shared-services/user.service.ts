import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user';


import { environment } from '../../environments/environment';    
import { AuthenticationService } from './authentication.service';

const SERVICE_URL = environment.serviceURL;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = SERVICE_URL + 'users';

  constructor(private http: HttpClient, private authenticService: AuthenticationService) { 
    console.log('🔍 [UserService] SERVICE_URL:', SERVICE_URL);
    console.log('🔍 [UserService] baseUrl:', this.baseUrl);
  }

  getUserByUsername(username: string): Observable<User> {
    const url = `${this.baseUrl}/${username}`;
    return this.http.get<User>(url);
  }

  updateUserByUsername(username: string, userDTO: User): Observable<User> {
    const url = `${this.baseUrl}/${username}`;
    return this.http.put<User>(url, userDTO);
  }

  getUsers(): Observable<User[]> {
    const url = this.baseUrl + '/';
    console.log('🔍 [UserService] Making request to:', url);
    return this.http.get<User[]>(url);
  }


  getUsersRole(): Observable<any[]> {
    return this.http.get<any[]>(SERVICE_URL + 'authenticate/userRoles');
  }

  updateUserRole(username: string, newRole: string) {
    const apiUrl = `${SERVICE_URL}authenticate/userRole/${username}/${newRole}`;
    return this.http.get<any[]>(apiUrl);
  }

  storeuserNameData: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public userName$ = this.storeuserNameData.asObservable();

  storeUserName() {
    this.getUserByUsername(this.authenticService.getUsername()).subscribe((val) => {
      this.storeuserNameData.next(val?.name);
      localStorage.setItem('userName', val?.name)
    })
  }

}
