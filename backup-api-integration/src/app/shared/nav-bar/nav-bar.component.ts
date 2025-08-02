import { Component, OnInit , HostListener, Renderer2, ElementRef  } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastType } from 'src/app/services/toaster';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { CartService, Cart } from 'src/app/services/cart.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  isCollapsed = true;
  isLoggedInFlag = "false";
  username = "";
  cartItems: any[] = [];
  cart: Cart
  parentCategories: any[] = [];
  subCategories: any[] = [];
  searchText: string;
  suggestions: string[];
  dropdownActive: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private loadingService: LoadingOverlayService,
    private searchService: SearchService,
    private router: Router,
    private toaster: ToasterService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private renderer: Renderer2, private el: ElementRef
  ) {
    router.events.subscribe(val => {
      this.isCollapsed = true;
    });

    this.authenticationService.isUserLoggedIn.subscribe((data) => {
      this.isLoggedInFlag = data;
    })

  }

  navigateToLogin(): void {
    this.router.navigate(['login']);  // Navigates to the login route
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.parentCategories = categories.filter(cat => cat.parentId === null || cat.parentId === undefined);
      this.subCategories = categories.filter(cat => cat.parentId !== null && cat.parentId !== undefined);
    });

    this.userService.storeUserName();

    this.userService.userName$.subscribe(val => {
      if (val != '') {
        this.username = val
      } else {
        this.username = localStorage.getItem('userName') ?? '';
      }
      this.updateCart()
    })
  }

  updateCart(): void {
    this.cartService.getCart().subscribe(val => {
      this.cart = val;
    });

  }

  getSubCategories(parentId: number): any[] {
    return this.subCategories.filter(subCat => subCat.parentId === parentId);
  }

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

  private getSuggestions(query: string): string[] {
    if (query) {
      this.searchService.getTopSearchKeywords(query).subscribe(keywords => {
        this.suggestions = keywords;
      })
    }
    return this.suggestions;
  }

  public initiateSearch(searchText: string) {
    this.router.navigate(['/categoryItems'], { queryParams: { search: 'searchResults' } });
    this.suggestions = [];
    if (this.searchText) {
      this.loadingService.showLoadingOverlay("Loading", 5000);
      this.searchService.searchToys(this.searchText).subscribe(toys => {
        this.loadingService.hideLoadingOverlay();
        // Clear suggestions when user searches

        this.searchService.updateSearchResult(toys);
        this.suggestions = [];

      });
      var btnCloseMobile: HTMLElement = document.getElementById('buttonCloseMobile')
      btnCloseMobile.click();
    }
  }

  getLoginTitle() {
    return this.isLoggedin() ? "Account Settings" : "Login"
  }

  mobileView() {
    if (window.innerWidth < 992) {
      return true;
    }
    return false;
  }

  isAdminLinkVisible() {
    return this.isLoggedin() && this.authenticationService.isUserAdmin();
  }

  public isLoggedin() {
    return (this.isLoggedInFlag == "true");
  }

  public logout() {
    localStorage.removeItem('userName')
    this.authenticationService.logoutUser();
    this.toaster.showToast("You have been logged out!", ToastType.Info, 3000);
    this.router.navigate(['/']);
    this.userService.storeuserNameData.next('')
  }

  toggleDropdown() {
    this.dropdownActive = !this.dropdownActive;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    // const clickedInside = this.el.nativeElement.contains(event.target);
    // if (!clickedInside) {
      // Clicked outside the component, close the suggestion box
      this.suggestions = [];
    // }
  }

}




