import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from 'src/app/services/catalog.service';
import { AgeRange } from 'src/app/services/categoryToy';
import KidsAge from 'src/app/services/kids-age';
import { RecommendationsTsService } from 'src/app/services/recommendations.ts.service';


@Component({
  selector: 'app-age-category',
  templateUrl: './age-category.component.html',
  styleUrls: ['./age-category.component.scss']
})
export class AgeCategoryComponent implements OnInit {

  constructor(private router: Router, 
    private recommendations: RecommendationsTsService, 
    private catalogService: CatalogService) {}

    navigateToAgeWiseCategory(ageRangeIndex: number) {
      let ageWiseRange: string = "None";
  
      switch (ageRangeIndex) {
        case KidsAge.NONE:
          ageWiseRange = "NONE";
          break;
        case KidsAge.ZEROTOONE:
          ageWiseRange = "ZEROTOONE";
          break;
        case KidsAge.TWOTOTHREE:
          ageWiseRange = "TWOTOTHREE";
          break;
        case KidsAge.FOURTOFIVE:
          ageWiseRange = "FOURTOFIVE";
          break;
        case KidsAge.SIXTOSEVEN:
          ageWiseRange = "SIXTOSEVEN";
          break;
        case KidsAge.EIGHTTOTEN:
          ageWiseRange = "EIGHTTOTEN";
          break;
        case KidsAge.ELEVENTOTWELVE:
          ageWiseRange = "ELEVENTOTWELVE";
          break;
        default:
          break;
      }
  
      // Navigate to AgeBaseCatalogComponent with path parameter as ageWiseRange
      this.navigate(ageWiseRange);
    }
  
    navigate(ageCategory: string) {
      this.router.navigate(['/ageBasedCatalog', ageCategory]);
    }

  navigateToCatalog(age: string) {
  // this.router.navigate(['/catalog'], { queryParams: { age: age  } });
  let fromVal = 0;
  let toVal = 0;

    if(Number(age) === 1) {
      fromVal = 0;
      toVal = 1;
    } else if(Number(age) === 2) {
      fromVal = 1;
      toVal = 3;
    } else if(Number(age) === 3) {
      fromVal = 4;
      toVal = 5;
    } else if(Number(age) === 4) {
      fromVal = 6;
      toVal = 7;
    } else if(Number(age) === 5) {
      fromVal = 8;
      toVal = 10;
    } else if(Number(age) === 6) {
      fromVal = 11;
      toVal = 12;
    }

    let ageRange: AgeRange = {
      from: fromVal,
      to: toVal
    };
    
    this.catalogService.setSelectedAgeRange(ageRange);
    this.router.navigate([`categoriesSummary`]);
  }

  ngOnInit(){
    this.recommendations.updateRecommendations([]);
  }

 

}
