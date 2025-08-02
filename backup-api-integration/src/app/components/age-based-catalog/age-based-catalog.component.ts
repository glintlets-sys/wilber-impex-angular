import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/services/category';
import { CategoryService } from 'src/app/services/category.service';
import KidsAge from 'src/app/services/kids-age';
import { Toy } from 'src/app/services/toy';

@Component({
  selector: 'app-age-based-catalog',
  templateUrl: './age-based-catalog.component.html',
  styleUrls: ['./age-based-catalog.component.scss']
})
export class AgeBasedCatalogComponent {
  @Input() ageCategory: string;
  ageCategoryIndex: number | undefined;
  ageCategoryString: string | undefined;
  toys: Toy[] = [];
  filteredToys: Toy[] = [];
  categorySelected: Category | undefined;

  constructor(private route: ActivatedRoute, private categoryService: CategoryService) {}

  breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Product' }
  ];

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

  updateBreadcrumbLabel(targetLabel: string, newTitle: string) {
    const breadcrumbItem = this.breadcrumbItems.find(item => item.label === targetLabel);
    if (breadcrumbItem) {
        breadcrumbItem.label = newTitle;
    }
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
  if (this.categorySelected !== undefined) {
    this.navigateToMore(this.categorySelected);
    this.filteredToys = [...this.filteredToys];
  }
  else {
    this.filteredToys = [...this.toys];
  }
  for (let key in selectedFilters) {
      const filter = this.filterElements.find(f => f.key === key);
      if (!filter) continue;

      const minValue = selectedFilters[key].min;
      const maxValue = selectedFilters[key].max;

      switch (key) {
          case 'brand':
          case 'colour':
          case 'skillset':
              this.filteredToys = this.filteredToys.filter(toy => toy[key] === selectedFilters[key]);
              break;

          case 'price':
              this.filteredToys = this.filteredToys.filter(toy => 
                  toy.price.amount >= minValue && toy.price.amount <= maxValue
              );
              break;

          case 'ageRange':
              this.filteredToys = this.filteredToys.filter(toy => 
                  toy.ageRange.from <= maxValue && toy.ageRange.to >= minValue
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
              // Handle other fields if necessary
              break;
      }
  }
}



  ngOnInit(): void {
    if (this.ageCategory) {
      // Map age category to index using KidsAge enum
      this.ageCategoryIndex = KidsAge[this.ageCategory as keyof typeof KidsAge];
      this.ageCategoryString = this.getCategoryString(this.ageCategory);
      this.updateBreadcrumbLabel("Product", this.ageCategoryString);
      this.loadAgeBasedCategories();
    } else {
      this.route.params.subscribe(params => {
        const routeAgeCategory = params['ageCategory'];
        if (routeAgeCategory) {
          this.ageCategory = routeAgeCategory;
          // Map age category to index using KidsAge enum
          this.ageCategoryIndex = KidsAge[routeAgeCategory as keyof typeof KidsAge];
          this.ageCategoryString = this.getCategoryString(routeAgeCategory);
          this.loadAgeBasedCategories();
          this.updateBreadcrumbLabel("Product", "Age Group: " + this.ageCategoryString);
        }
      });
    }
  }

  navigateToMore(selectedCategory: Category)
  {
    this.categorySelected = selectedCategory;
    this.filteredToys = this.toys.filter(toy => toy.categories && toy.categories.includes(selectedCategory.id));
  }

  private getCategoryString(ageCategory: string) {
    let ageWiseRange: string;
    switch (ageCategory) {
      case "ZEROTOONE":
        ageWiseRange = "Zero to One";
        break;
      case "TWOTOTHREE":
        ageWiseRange = "Two to Three";
        break;
      case "FOURTOFIVE":
        ageWiseRange = "Four to Five";
        break;
      case "SIXTOSEVEN":
        ageWiseRange = "Six to Seven";
        break;
      case "EIGHTTOTEN":
        ageWiseRange = "Eight to Ten";
        break;
      case "ELEVENTOTWELVE":
        ageWiseRange = "Eleven to Twelve";
        break;
      default:
        break;
    }
    return ageWiseRange;

  }

  categories: Category[] = []; // Adjust the type of categories
  allCategories: Category[] = [];
  public loadAgeBasedCategories()
  {
    // fetch all categories from category service. 
    this.categoryService.categories$.subscribe((value: Category[]) => {
      this.allCategories = value;
         // Map kidsAge property based on ageCategoryIndex
      // Filter categories based on kidsAge property
        if (this.ageCategoryIndex !== undefined) {
          this.allCategories.forEach(category=>{
            console.log(category.kidsAge  +  this.ageCategoryIndex);
            const index = Object.values(KidsAge).indexOf(category.kidsAge);
            if(index === this.ageCategoryIndex) {
              this.categories.push(category);
            }
          })
        }

        // after categories are loaded. load toys. 
        if(this.categories !== undefined) {
          this.categories.forEach(category=>{
            this.categoryService.getToysByCategoryId(category.id).subscribe(value =>{
              this.toys.push(... value);
              this.updateFilterElementsOptions(this.toys);
            })
          })
        }

    });

    

  }

}
