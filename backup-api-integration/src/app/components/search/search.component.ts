import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchService } from 'src/app/services/search.service';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
// ... (the rest of the imports and the component metadata)

export class SearchComponent implements OnInit {
  public suggestions: string[] = [];

  constructor(private searchService: SearchService,
    private loadingService: LoadingOverlayService) { }

  ngOnInit(): void { }
  searchText: string = '';
  searchResult: any[] = [];
  searchResultNull: boolean = false;

  onSearch(query: string): void {
      if (query) {
          this.suggestions = this.getSuggestions(query);  // Sample data method or backend call
      } else {
          this.suggestions = [];
      }
  }

  onSuggestionClick(suggestion: string, event: Event): void {
      event.preventDefault();  // prevent default anchor behavior
      this.searchText = suggestion;
      this.suggestions = [];  // clear the suggestions
      this.initiateSearch(this.searchText);  // Execute the actual search
  }

  initiateSearch(query: string): void {
    if (this.searchText) {
      this.loadingService.showLoadingOverlay("Loading",5000);
      this.searchResultNull = false;
      this.searchService.searchToys(this.searchText).subscribe(toys => {
        this.searchResult = toys;
        this.loadingService.hideLoadingOverlay();
        if(this.searchResult.length == 0 )
        {
          this.searchResultNull = true;
        }
        // Clear suggestions when user searches
        this.suggestions = [];
      });
    }
  }

  private getSuggestions(query: string): string[] {

    if(query) {
      this.searchService.getTopSearchKeywords(query).subscribe(keywords =>{
        this.suggestions = keywords;
      })
    }
      return this.suggestions;
  }
}
