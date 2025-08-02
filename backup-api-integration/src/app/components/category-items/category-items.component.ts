import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { Breadcrumb, Category } from 'src/app/services/category';
import { SearchService } from 'src/app/services/search.service';
import { Toy } from 'src/app/services/toy';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-category-items',
  templateUrl: './category-items.component.html',
  styleUrls: ['./category-items.component.scss']
})
export class CategoryItemsComponent implements OnInit , OnDestroy{
  toys: Toy[] = [];
  filteredToys: Toy[] = [];
  categoryId: string;
  isSearchResult = false;
  allCategories: Category[] = [];
  category: Category;
  breadcrumbItems = [];
  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  sortBy = [
    { label: 'min', value: 'Low to High' },
    { label: 'max', value: 'High to Low' },
  ];
  selectedSortOption: string = '';
  private unsubscribe$ = new Subject<void>(); // Subject for unsubscribing
  private subscription: Subscription;
  loading: boolean = false;
  constructor(private route: ActivatedRoute,
    private searchService: SearchService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchQuery = params['search']; // 'search' is the query parameter key
      if (searchQuery) {
        this.isSearchResult = true;
        this.searchService.getSearchResultsObj().subscribe(
          val => {
            this.filteredToys = val;
          }
        )
      }
    });
   

    this.route.params.subscribe(params => {
      let categoryId = params['categoryId'];
      this.filteredToys = [];
      this.loading = false;
      this.hasMore = true;
      this.page = 0;
      this.toys = [];
      this.updateFilterElementsOptions(this.toys);
      if (categoryId) {
        this.categoryId = categoryId;
        this.loadMoreToys()
        this.loadCategories();
      }
    });
  }
  hasMore: boolean = true;
  page: number = 0;
  loadMoreToys(): void {
    if (this.loading || !this.hasMore) return; // Prevent duplicate loads
    this.loading = true;
    if(!this.categoryId)
    {
      return ;
    }

    this.categoryService.getToysByCategoryIdPaginated(Number.parseInt(this.categoryId), this.page, 12).subscribe({
      next: (response: any) => {
        if (response.content.length) {
          this.toys.push(...response.content); // Append new toys
          this.filteredToys = this.toys;
          this.updateFilterElementsOptions(this.toys);
          this.page++; // Increment page number for the next request
        } else {
          this.hasMore = false; // No more items to load
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading toys:', err);
        this.loading = false;
      }
    });
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const threshold = clientHeight * 1.3;
    if ((scrollTop + clientHeight) >= scrollHeight - threshold) { // Load more when near bottom
      this.loadMoreToys();
    }
  }

  getVal(val) {
    return JSON.stringify(val);
  }

  ngOnDestroy(): void {
    // Emit a value to complete the Subject and clean up subscriptions
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  trackByFn(index, item) {
    // Implementation depends on the nature of items in filteredToys
    return item.id; // or another unique property of the items
  }

  public loadCategories() {
    // fetch all categories from category service. 
    this.categoryService.categories$.subscribe((value: Category[]) => {
      this.allCategories = value;
      this.allCategories.forEach(category => {
        if (category.id + "" === this.categoryId) {
          this.category = category;
          this.updateBreadcrumb();
        
        }
      })
     // this.addChildren();
    });
  }

  addChildren() {
    this.allCategories.forEach(category => {
      if (category?.parentId + "" === this.categoryId) {
        this.categoryService.getToysByCategoryId(category.id).subscribe(value => {
          this.toys.push(...value);
          this.updateFilterElementsOptions(this.toys);
          this.filteredToys = [...this.toys];
          this.filteredToys = Array.from(new Map(this.filteredToys.map(toy => [toy.id, toy])).values());
        })
      }

    })
  }

  filterElements = [
    { label: 'Brand', key: 'brand', type: 'select', options: [] },
    { label: 'Colour', key: 'colour', type: 'select', options: [] },
    { label: 'Skill Set', key: 'skillset', type: 'select', options: [] },
    {
      label: 'Age Range',
      key: 'ageRange',
      type: 'range',
      range: [0, 15], // <-- this should be an array
      config: {
        start: [0, 15], // <-- start values
        connect: true,
        step: 1,
        range: {
          'min': 0,
          'max': 15
        }
      }
      ,
    },
    {
      label: 'Price',
      key: 'price',
      type: 'range',
      range: [0, 3000], // <-- this should be an array
      config: {
        start: [0, 3000], // <-- start values
        connect: true,
        step: 1,
        range: {
          'min': 0,
          'max': 3000
        }
      }
      ,
    },
    {
      label: 'Discount',
      key: 'discount',
      type: 'range',
      range: [0, 100], // <-- this should be an array
      config: {
        start: [0, 100], // <-- start values
        connect: true,
        step: 1,
        range: {
          'min': 0,
          'max': 100
        }
      }
      ,
    },
    // Add more filter elements as required
  ];

  updateBreadcrumb() {
    let breadcrum: Breadcrumb[] = this.category.breadcrumb;
    this.breadcrumbItems = [];
    breadcrum.forEach(val => {
      this.updateBreadcrumbLabel(val.name, "/categoryItems/" + val.id);
    })
    localStorage.setItem("breadCrumbUrl", JSON.stringify(this.breadcrumbItems))
  }

  updateBreadcrumbLabel(label: string, url: string) {
    this.breadcrumbItems.push({ 'label': label, 'url': url })
  }

  updateFilterElementsOptions(toys: Toy[]): void {
    // Extract unique values for each field from the Toy[] array
    const uniqueBrands = Array.from(new Set(toys.map(toy => toy.brand)));
    const uniqueColours = Array.from(new Set(toys.map(toy => toy.brandColor)));
    const uniqueSkillSets = Array.from(new Set(toys.map(toy => toy.skillSet)));

    // Iterate over filterElements and update the options for relevant keys
    for (const filterElement of this.filterElements) {
      switch (filterElement.key) {
        case 'brand':
          filterElement.options = uniqueBrands;
          break;
        case 'colour':
          filterElement.options = uniqueColours;
          break;
        case 'skillset':
          filterElement.options = uniqueSkillSets;
          break;
        default:
          break;
      }
    }
  }

  onFilterChange(selectedFilters: any) {
    this.filteredToys = JSON.parse(JSON.stringify(this.toys));
    let keys = selectedFilters.flatMap(obj => Object.keys(obj));
    for (let key in keys) {
      const filter = this.filterElements.find(f => f.key === keys[key]);
      if (!filter) continue;
      let minValue = 0
      let maxValue = 0
      if (keys[key] == 'ageRange') {
        minValue = selectedFilters[key]?.ageRange[0].min;
        maxValue = selectedFilters[key]?.ageRange[0].max;
      }

      if (keys[key] == 'price') {
        minValue = selectedFilters[key]?.price[0].min;
        maxValue = selectedFilters[key]?.price[0].max;
      }

      if (keys[key] == 'discount') {
        minValue = selectedFilters[key]?.discount[0].min;
        maxValue = selectedFilters[key]?.discount[0].max;
      }

      switch (keys[key]) {
        case 'brand':
          this.filteredToys = this.filteredToys.filter(toy => selectedFilters[key]?.brand.includes(toy.brand));
          break;
        case 'colour':
        case 'skillset':
          this.filteredToys = this.filteredToys.filter(toy => selectedFilters[key]?.skillset.includes(toy.brand));
          break;
        case 'price':
          this.filteredToys = this.filteredToys.filter(toy =>
            toy.price?.amount >= minValue && toy.price?.amount <= maxValue
          );
          break;
        case 'ageRange':
          this.filteredToys = this.filteredToys.filter(toy =>
            toy.ageRange?.from >= minValue && toy.ageRange?.to <= maxValue
          );
          break;
        case 'discount':
          this.filteredToys = this.filteredToys.filter(toy => {
            if (!toy.discount) {
              return minValue === 0; // Only include toys without a discount if the minimum value is 0
            }
            return toy.discount.discountPercent >= minValue && toy.discount.discountPercent <= maxValue;
          });
          break;
        default:
          break;
      }
    }
  }

  refreshFilterElement() {
    this.filterElements = [
      { label: 'Brand', key: 'brand', type: 'select', options: [] },
      { label: 'Colour', key: 'colour', type: 'select', options: [] },
      { label: 'Skill Set', key: 'skillset', type: 'select', options: [] },
      {
        label: 'Age Range',
        key: 'ageRange',
        type: 'range',
        range: [0, 15], // <-- this should be an array
        config: {
          start: [0, 15], // <-- start values
          connect: true,
          step: 1,
          range: {
            'min': 0,
            'max': 15
          }
        }
        ,
      },
      {
        label: 'Price',
        key: 'price',
        type: 'range',
        range: [0, 3000], // <-- this should be an array
        config: {
          start: [0, 3000], // <-- start values
          connect: true,
          step: 1,
          range: {
            'min': 0,
            'max': 3000
          }
        }
        ,
      },
      {
        label: 'Discount',
        key: 'discount',
        type: 'range',
        range: [0, 100], // <-- this should be an array
        config: {
          start: [0, 100], // <-- start values
          connect: true,
          step: 1,
          range: {
            'min': 0,
            'max': 100
          }
        }
        ,
      },
      // Add more filter elements as required
    ];
  }

}





