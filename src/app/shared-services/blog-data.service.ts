import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BlogDataService {
  private blogs: Blog[] = [];
  
  private apiUrl = environment.serviceURL + 'blogs'; // Replace 'your-api-url' with the actual API URL

 

  constructor(private http: HttpClient) { }

  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  getBlogById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }
  /*
  getAllBlogs(): Blog[] {
    return this.blogs;
  }

  getBlogById(id: number): Blog | undefined {
    return this.blogs.find((blog) => blog.id === id);
  } */
}
export interface Blog {
  id: number;
  title: string;
  imageUrl: string;
  content: string;
  shortContent?: string;
  author?: string;
  authorTitle?: string;
  authorPic?: string;
  readTime?:number;
}
