import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Toy } from './toy';
import { Observable, BehaviorSubject, of, combineLatest } from 'rxjs';
import { flatMap, filter, first, tap } from 'rxjs/operators';
import { toArray, map } from 'rxjs/operators';
import { AgeRange, CategoryToy } from './categoryToy';
import { concatMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LoadingOverlayService } from './loading-overlay.service';

const SERVICE_URL = environment.serviceURL;

@Injectable({
    providedIn: 'root'
})
export class CatalogService {
 

    private readonly apiUrl = SERVICE_URL + 'catalog/';
    private readonly apiToyUrl = SERVICE_URL + 'toys/'
    private readonly apiFeaturedItemsUrl = SERVICE_URL + 'featuredItems/'

    private stockCountMap: Map<number, BehaviorSubject<number>> = new Map<number, BehaviorSubject<number>>();

    private catalogItems$: BehaviorSubject<Toy[]> = new BehaviorSubject([]);

    private cache$: BehaviorSubject<CategoryToy[] | null> = new BehaviorSubject(null);
    private isLoading = false;

    public selectedAgeRange$: BehaviorSubject<AgeRange | null> = new BehaviorSubject(null);
    public selectedCategory$: BehaviorSubject<number | null> = new BehaviorSubject(null);

    setSelectedCategory(categoryId: number) {
        this.selectedCategory$.next(categoryId);
    }

    setSelectedAgeRange(ageRange: AgeRange | null) {
        this.selectedAgeRange$.next(ageRange);
    }

    constructor(private http: HttpClient, private loadingOverlay: LoadingOverlayService) {
        //this.loadDataIfNeeded();
        this.loadFeaturedData();
        this.fetchPreviouslyViewedItems();

    }

    getCombinedResult(age: number, gender?: string[]): Observable<CategoryToy[]> {
        const url = `${this.apiUrl}combinedResult/${age}`;
        const params = gender ? { gender } : {};

        return this.http.get<CategoryToy[]>(url, { params });
    }

    // Method to filter the cache based on the selected AgeRange and return an Observable
    private filterCacheByAgeRange(ageRange: AgeRange | null): Observable<CategoryToy[] | null> {
        return this.cache$.pipe(
            map((cacheValue) => {
                if (!cacheValue || !ageRange) {
                    return cacheValue;
                }

                return cacheValue.filter((categoryToy: CategoryToy) => {
                    const category = categoryToy.category;
                    return category.age.from >= ageRange.from && category.age.to <= ageRange.to;
                });
            })
        );
    }

    // Method to get the showcase categories (filtered cache based on the selected AgeRange)
    getShowcaseCategories(): Observable<CategoryToy[]> {
        const selectedAgeRange$ = this.selectedAgeRange$.asObservable();
        const filteredCache$ = this.filterCacheByAgeRange(this.selectedAgeRange$.getValue());

        return combineLatest([selectedAgeRange$, filteredCache$]).pipe(
            map(([selectedAgeRange, filteredCache]) => {
                if (!filteredCache && !this.isLoading) {
                    this.loadCategoriesData();
                }

                return filteredCache || [];
            })
        );
    }

    public pageNumber$: BehaviorSubject<number | null> = new BehaviorSubject(null);

    private loadCategoriesData() {
        if (this.dataLoading) {
            this.load(false, 6);
        }
    }

    dataLoading: boolean = true;

    private load(shuffle: boolean, pageSize: number): void {
        this.isLoading = true;
        let pageNumber = 0;
        const loadPage = () => {
            this.http.get<CategoryToy[]>(this.apiUrl + 'categories', {
                params: new HttpParams()
                    .set('page', pageNumber.toString())
                    .set('size', pageSize), // Change according to your page size
            }).pipe(
                concatMap(data => {
                    const currentData = this.cache$.getValue() || [];
                    if (data.length > 0) {

                        if (shuffle) {
                            data = this.shuffleData(data);
                        }

                        this.cache$.next([...currentData, ...data]);
                        this.dataLoading = true;
                        pageNumber++;
                        loadPage();
                    } else {
                        this.isLoading = false;
                        this.dataLoading = false;
                    }
                    return this.cache$;
                })
            ).subscribe();
        }

        loadPage();
    }

    private shuffleData(data: CategoryToy[]): CategoryToy[] {
        return data.slice().sort(() => Math.random() - 0.5);
    }


    getCategories(age: string, gender: string) {
        let categories: [] = [];
        return categories;
    }

    submitCategories(categories: any[]) {

    }

    getStockCount(itemId: number): BehaviorSubject<number> {
        if (!this.stockCountMap.has(itemId)) {
            this.stockCountMap.set(itemId, new BehaviorSubject<number>(0));
        }
        return this.stockCountMap.get(itemId);
    }

    fetchStockCount(itemId: number): void {
        this.http.get<number>(`${this.apiUrl}stockCount/${itemId}`).subscribe(
            (stockCount: number) => {
                const stockCountSubject = this.stockCountMap.get(itemId);
                if (stockCountSubject) {
                    stockCountSubject.next(stockCount);
                }
            },
            (error) => {
                console.error('Error fetching stock count:', error);
            }
        );
    }


    

    getStockCountForVariation(itemId: any, variationId: number) {
        if (itemId === null || variationId === null) {
            // Return an observable that emits 0 if either itemId or variationId is not defined
            return of(0);
        }
        return this.http.get<number>(`${this.apiUrl}stockCount/${itemId}/${variationId}`);
    }

    private loadData() {

        if(this.isLoading)
        {
            return;
        }

       // this.loadingOverlay.showLoadingOverlay("waiting", 20000);
        this.isLoading = true;
        console.log("loading data ... ");
        this.http.get<Toy[]>(this.apiUrl)
            .toPromise()
            .then((data) => {
              //  this.loadingOverlay.hideLoadingOverlay();
                console.log("loaded data .. total no:  " + data.length)
                this.catalogItems$.next(data);
                this.isLoading = false;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    public getCatalogItem(id: number): Observable<Toy> {
        // Check if the catalogItems$ BehaviorSubject has the item with the given id
        const cachedItem = this.catalogItems$.getValue().find(item => item.id === id);

        if (cachedItem) {
            // If the item is present in the cached data, return it as an Observable
            return of(cachedItem);
        } else {
            // If the item is not present in the cached data, fetch it from the API and update the catalogItems$ BehaviorSubject
            this.loadData();
            return this.http.get<Toy>(`${this.apiToyUrl}${id}`).pipe(
                tap((fetchedItem: Toy) => {
                    // Get the current value of catalogItems$
                    const currentItems = this.catalogItems$.getValue();
                    console.trace("reached getcatalog item non cached? ");
                    // Add the fetched item to the current items
                    const updatedItems = [...currentItems, fetchedItem];
                    console.log("fetched an item : " + fetchedItem.id);
                    // Update the BehaviorSubject with the new list of items
                    this.catalogItems$.next(updatedItems);
                })
            );
        }
    }

    //Returning the cached list of catalog Items from the service. 
    public getCatalogList(): Observable<Toy[]> {
        // Call loadDataIfNeeded() to ensure data is fetched if needed
        this.loadDataIfNeeded();
        return this.catalogItems$;
    }

    isLoadingData: boolean = false;
    private loadDataIfNeeded(): void {
        console.log("loadDataCalled. ")
        // Check if the catalogItems$ BehaviorSubject has any data
        if (this.catalogItems$.getValue().length === 0 && !this.isLoadingData) {
            this.loadData();
        }
    }

    /**
     * Featured data
     */
    private featuredCatalogItems$: BehaviorSubject<Toy[]> = new BehaviorSubject([]);
    private latestCatalogItems$: BehaviorSubject<Toy[]> = new BehaviorSubject([]);
    private bestSellerCatalogItems$: BehaviorSubject<Toy[]> = new BehaviorSubject([]);

    public getLatestList(): Observable<Toy[]> {
        if (this.featuredCatalogItems$.getValue().length === 0) {
            this.loadFeaturedData();
        }
        return this.latestCatalogItems$.asObservable();
    }

    public getBestSellerList(): Observable<Toy[]> {
        if (this.featuredCatalogItems$.getValue().length === 0) {
            this.loadFeaturedData();
        }
        return this.bestSellerCatalogItems$.asObservable();
    }

    private loadFeaturedData() {

        this.http.get<any>(`${this.apiFeaturedItemsUrl}with-toys`)
            .toPromise()
            .then((data) => {
                this.featuredCatalogItems$.next(data[0]?.toys);
                this.latestCatalogItems$.next(data[1]?.toys);
                this.bestSellerCatalogItems$.next(data[2]?.toys);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    public getFeaturedList(): Observable<Toy[]> {
        if (this.featuredCatalogItems$.getValue().length === 0) {
            this.loadFeaturedData();
        }
        return this.featuredCatalogItems$.asObservable();
    }

    getNextItem(currentItemId: number): Observable<Toy> {
        return this.getCatalogList().pipe(
            map((toys: Toy[]) => {
                const currentItemIndex = toys.findIndex(item => item.id === currentItemId);
                const nextItemIndex = (currentItemIndex + 1) % toys.length;
                return toys[nextItemIndex];
            })
        );
    }

    private previousViewedItem: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    public previousViewArr$: Observable<any[]> = this.previousViewedItem.asObservable();

    private previouslyViewedKey: string = "PREVIOUSLY_VIEWED";
    
    private fetchPreviouslyViewedItems() {
        if(localStorage.getItem(this.previouslyViewedKey)) {
            this.uniqueItem.next(JSON.parse(localStorage.getItem(this.previouslyViewedKey)));
            this.previousViewedItem.next(JSON.parse(localStorage.getItem(this.previouslyViewedKey)));
        }
    }

    private maxPreviouslyViewedSize =  4; //TODO: HARD CODED TO 10 - move this to client settings. 
    private updateNewItemIntoPreviouslyViewedItems() {
        let storedList: any[] = this.uniqueItem.value;
        // Check if the list exceeds the maximum allowed size
        if (storedList.length > this.maxPreviouslyViewedSize) {
            // Remove the oldest item(s) to ensure the list size stays at maxPreviouslyViewedSize
            storedList = storedList.slice(-this.maxPreviouslyViewedSize);
        }
        localStorage.setItem(this.previouslyViewedKey, JSON.stringify(storedList));
    }


    public UpdatePreviousViewData(item: any): void {
        const existingObject = this.previousViewedItem.value.find(data => data.id === item.id);
        if (!existingObject) {
            const currentArray = this.previousViewedItem.value.slice();
            currentArray.push(item);
            this.previousViewedItem.next(currentArray);
        }
        // this.filterPreviouseViewData(item)
    }

    private uniqueItem: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    public uniqueItemArr$: Observable<any[]> = this.uniqueItem.asObservable();

    public filterPreviouseViewData(item: any): void {
        this.previousViewArr$.subscribe((val: any) => {
            this.uniqueItem.next(val.filter(filterItem => filterItem.id !== item.id))
            this.updateNewItemIntoPreviouslyViewedItems();
        })
    }

}
