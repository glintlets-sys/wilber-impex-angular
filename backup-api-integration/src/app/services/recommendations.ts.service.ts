import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Toy } from './toy';
import { CatalogService } from './catalog.service';
import { Blog, BlogDataService } from './blog-data.service';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationsTsService {

  private recommendationsSubject: BehaviorSubject<Toy[]> = new BehaviorSubject<Toy[]>([]);
  public recommendations$: Observable<Toy[]> = this.recommendationsSubject.asObservable();

  private presentCategoryIdSubject: BehaviorSubject<Number> = new BehaviorSubject<Number>(0);
  public presentCategoryId: Observable<Number> = this.presentCategoryIdSubject.asObservable();

  constructor(private catelogService: CatalogService, 
    private categoryService: CategoryService,
    private blogService: BlogDataService) {

   }

   
  updatePresentCategoryId(categoryId: number)
  {
    this.presentCategoryIdSubject.next(categoryId);
    this.categoryService.getToysByCategoryId(categoryId).subscribe((data)=>{
      this.updateRecommendations(data);
    });
  }


  updateRecommendations(recommendations: Toy[]): void {
    // Update the recommendations and emit the new value to subscribers
    let recommends = JSON.parse(JSON.stringify(recommendations));
    this.recommendationsSubject.next(recommends);
  }

  addRecommendations(recommendations: Toy[]): void {
    // Merge the new recommendations with the existing recommendations
    const mergedRecommendations = [...this.recommendationsSubject.getValue(), ...recommendations];
    // Update the recommendations and emit the new value to subscribers
    this.recommendationsSubject.next(mergedRecommendations);
  }



  private recommendedBlogSubject: BehaviorSubject<Blog[]> = new BehaviorSubject<Blog[]>([]);
  public recommendedBlogs$: Observable<Blog[]> = this.recommendedBlogSubject.asObservable();

  getRecommendedBlogs(index: number): Observable<Blog[]> {
    this.blogService.getAllBlogs().subscribe(blogs => {
      const allBlogs = blogs;
      const startIndex = index + 1;
      const endIndex = startIndex + 4;

      if (endIndex <= allBlogs.length) {
        const recommendedBlogs = allBlogs.slice(startIndex, endIndex);
        this.recommendedBlogSubject.next(recommendedBlogs);
      } else {
        const remainingBlogsCount = endIndex - allBlogs.length;
        const recommendedBlogs = allBlogs.slice(startIndex).concat(allBlogs.slice(0, remainingBlogsCount));
        this.recommendedBlogSubject.next(recommendedBlogs);
      }
    });
    return this.recommendedBlogs$
  }

}
