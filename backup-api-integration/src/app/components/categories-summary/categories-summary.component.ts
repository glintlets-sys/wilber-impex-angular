import { Component, HostListener, Input } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { CatalogService } from 'src/app/services/catalog.service';
import { AgeRange, CategoryToy } from 'src/app/services/categoryToy';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { NavigationEnd } from '@angular/router';
import { filter, catchError} from 'rxjs/operators';
import { Observable, tap, of } from 'rxjs';
import { RecommendationsTsService } from 'src/app/services/recommendations.ts.service';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-categories-summary',
  templateUrl: './categories-summary.component.html',
  styleUrls: ['./categories-summary.component.scss']
})
export class CategoriesSummaryComponent implements OnInit, OnDestroy {
  categories: CategoryToy[];
  categoryDetail: CategoryToy = null;

  @Input()
  categoryId: string | null = null;

  selectedCategoryId: string | null = null;

  @Input()
  itemId: string | null = null;

  @Input()
  maxItems: number = 0;


  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private catalogService: CatalogService,
    private router: Router,
    private route: ActivatedRoute,
    private recommendationService: RecommendationsTsService,
    private loadingService: LoadingOverlayService) {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.route.paramMap.subscribe(params => {
        this.categoryId = params.get('categoryId');
        this.selectedCategoryId = this.categoryId;
        console.log(`categoryId: ${this.categoryId}`);
        //this.getAllCategories(); // Or call another method that you want to run again
        this.loadCategoriesAndData(); // Call the method that loads categories and other data
        this.lastLoadedIndexAbove = 0; // Index of the last loaded category
        this.lastLoadedIndexBelow = 0; // Index of the last loaded category
        this.loadedCategories = [];
        this.topIndex = 0;
        this.bottomIndex =0;
      });
    

    });

  }

  loadCategoriesAndData(): void {
   // this.loadedCategories = [];
    this.getAllCategories();
    this.loadMoreCategoriesBelow();
  }

  ngOnInit(): void {
    this.catalogService.selectedAgeRange$.subscribe(val => {
      this.ageCategorySelected = (val !== null);
      this.ageRange = val;

      if(val == null) {
        this.catalogService.setSelectedAgeRange({'from': 6,"to":7});
        this.ageCategorySelected = true;
        this.ageRange = {'from':6,"to":7};
      }
    })
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('categoryId');
      if ((this.categoryId === null) && (this.selectedCategoryId !== null)) {
        this.categoryId = this.selectedCategoryId;
      } else 
      {
        this.catalogService.selectedCategory$.subscribe(val => {
          this.selectedCategoryId = this.categoryId;
        })
      }
      console.log(`categoryId: ${this.categoryId}`);
      this.loadCategoriesAndData();
      
    });
    this.waitForData();
   
  }

  public ageRange: AgeRange;

  canDisplayAgeCategoryInEnd() {
    return this.ageCategorySelected;
  }

  private ageCategorySelected = false;

  canDisplayAgeCategory(i: number) {
    if (this.ageCategorySelected) {
      return false;
    } else {
      return (((i+1) % 6) === 0);
    }
  }


  waitForData() {
    const checkInterval = 1000; // Adjust the interval as needed (in milliseconds)
    this.startLoading();
    const checkDataInterval = setInterval(() => {
      if (this.categories.length > 0) {
        this.stopLoading();
        this.loadMoreCategoriesBelow();
        clearInterval(checkDataInterval);
      }
    }, checkInterval);

  }

  startLoading() {
    this.loadingService.showLoadingOverlay("Loading", 10000);
  }

  stopLoading() {
    this.loadingService.hideLoadingOverlay();
  }

  //Custom loading to optimize the memory on screen. 

  loadedCategories: CategoryToy[] = []; // Categories to display
  batchSize = 2; // Number of categories to load at a time
  loading = false; // To prevent loading multiple times on quick scrolls
  lastLoadedIndexAbove = 0; // Index of the last loaded category
  lastLoadedIndexBelow = 0; // Index of the last loaded category
  maxVisibleCategories = 6;
  @Input() scrollThresholdAbove: number = 1500; // Default value for above
  @Input() scrollThresholdBelow: number = 1500; // Default value for below


  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.scrollHeight;
  
    if (((scrollPosition - 1000)) <= this.scrollThresholdAbove) {
      this.loadMoreCategoriesAbove();
    }
  
    if ((documentHeight - scrollPosition) <= this.scrollThresholdBelow) {
      this.loadMoreCategoriesBelow();
    } 
  }
  topIndex: number = 0;
  bottomIndex: number = 0;

  loadMoreCategoriesAbove(): void {
    if (!this.loading && this.topIndex > 0) {
      this.loading = true;

      const endIndex = this.topIndex - 1;
      const startIndex = Math.max(0, endIndex - this.batchSize + 1);

      const nextCategories = this.categories.slice(startIndex, this.topIndex);

      if (nextCategories.length > 0) {
        this.loadedCategories.unshift(...nextCategories);
        const removedItems = this.loadedCategories.splice(this.maxVisibleCategories); // Use maxVisibleCategories here
        this.topIndex -= nextCategories.length; // Move topIndex by the number of added items
        this.bottomIndex -= removedItems.length; // Move bottomIndex by the number of removed items
      }

      this.loading = false;
    }
  }

  loadMoreCategoriesBelow(): void {
    if (!this.loading && this.bottomIndex < this.categories.length) {
      this.loading = true;

      const startIndex = this.bottomIndex;
      const endIndex = Math.min(this.categories.length, this.bottomIndex + this.batchSize);

      const nextCategories = this.categories.slice(startIndex, endIndex);

      if (nextCategories.length > 0) {
        this.loadedCategories.push(...nextCategories);
        const removedItems = this.loadedCategories.splice(0, this.loadedCategories.length - this.maxVisibleCategories);
        this.bottomIndex += nextCategories.length; // Move bottomIndex by the number of added items
        this.topIndex += removedItems.length; // Move topIndex by the number of removed items

        if (this.topIndex === 0) {
          this.loadMoreCategoriesAbove(); // Trigger loading more above if needed
        }
      }

      this.loading = false;
    }
  }
  

  getAllCategories(): void {
    this.catalogService.getShowcaseCategories().subscribe(
      (categories) => {
        this.categories = categories.filter(categoryToy => categoryToy.toys && categoryToy.toys.length > 0);

        if (this.categoryId !== null) {
          this.fetchToysForCategory();
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  loadingAllCatogires: boolean = false;

 /* getAllCategories(): Observable<CategoryToy[]> {
    if (!this.loadingAllCatogires) {
      this.loadingAllCatogires = true;
  
      return this.catalogService.getShowcaseCategories().pipe(
        tap((categories) => {
          this.categories = categories.filter(categoryToy => categoryToy.toys && categoryToy.toys.length > 0);
          if (this.categoryId !== null) {
            this.fetchToysForCategory();
          }
          this.loadingAllCatogires = false; // Set loading state back to false on success
        }),
        catchError((error) => {
          console.error('Error fetching categories:', error);
         // this.loadingAllCatogires = true; // Set loading state back to false on error
          throw error;
        })
      );
    } else {
      // Return an empty observable or handle differently when loading is already in progress
      return of([]);
    }
  }*/
  

  ngOnDestroy(): void {
    // Unsubscribe from the router's events observable when the component is destroyed
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe().unsubscribe();
  }



  fetchToysForCategory(): void {
    if (this.categoryId !== null) {
      const categoryIdNumber = Number(this.categoryId);

      // 1. Identify the category whose .category.id matches the given category Id
      this.categoryDetail = JSON.parse(JSON.stringify(this.categories.find(categoryToy => categoryToy.category.id === categoryIdNumber)));

      // 2. Remove it from this.categories
      if (this.categoryDetail) {
        this.categories = this.categories.filter(categoryToy => categoryToy.category.id !== categoryIdNumber);

        // 3. Add it to the categoryDetail object
        this.categoryService.getToysByCategoryId(categoryIdNumber).subscribe(
          (toys) => {
            // 4. Replace the toys of categoryDetail.toys with toys from the fetchToys method

            if (this.itemId !== null) {
              this.categoryDetail.toys = toys.filter(toy => toy.id === Number(this.itemId));
            } else {
              this.categoryDetail.toys = toys;
            }

            // If you want to do something with the updated categoryDetail, you can do it here
          },
          (error) => {
            console.error('Error fetching toys:', error);
          }
        );
      }
    }
  }

  navigateToMore(category) {
    this.catalogService.setSelectedAgeRange(category.age);
    this.router.navigate([`categoriesSummary/${category.id}`]);
  }

}
