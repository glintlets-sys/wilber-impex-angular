import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Toy, ProductDescription } from './toy';
import { CatalogService } from './catalog.service';

@Injectable({
  providedIn: 'root'
})
export class ToyService {
 
  private apiUrl: string = environment.serviceURL;

  private toysSubject: BehaviorSubject<Toy[]> = new BehaviorSubject<Toy[]>([]);
  private toysLoaded: boolean = false;
  private toysMap: Map<number, Toy> = new Map();

  constructor(private http: HttpClient, private catalogService: CatalogService) { }

  //getAllToys(): Observable<Toy[]> {
  //   return this.http.get<Toy[]>(`${this.apiUrl}toys/`);
  //}


  loadImagestoCMS()
  {
    return  this.http.get<Toy[]>(`${this.apiUrl}toys/updatePhotoLinksFromS3`)
  }

  getAllToysNonPaginated(): Observable<Toy[]> {
    if (!this.toysLoaded) {
      this.toysLoaded = true
      this.http.get<Toy[]>(`${this.apiUrl}toys/`).subscribe(
        toys => {
          this.toysMap.clear();
          toys.forEach(toy => this.toysMap.set(toy.id, toy));
          this.toysSubject.next(toys);
          this.toysLoaded = true;
        },
        error => {
          this.toysLoaded = false
          console.error('Error fetching toys', error);
        }
      );
    }
    return this.toysSubject.asObservable();
  }

  getAllToys(pageNumber: number = 0, pageSize: number = 10): Observable<Toy[]> {
    if (!this.toysLoaded) {
      this.loadToysRecursively(pageNumber, pageSize);
    }
    return this.toysSubject.asObservable();
  }
  
  private loadToysRecursively(pageNumber: number, pageSize: number): void {
    this.http.get<any>(`${this.apiUrl}toys/pagination`, {
      params: {
        page: pageNumber.toString(),
        size: pageSize.toString()
      }
    }).subscribe(
      response => {
        const toys = response.content;  // Access the 'content' field directly
        //console.log(JSON.stringify(response));
        toys.forEach(toy => this.toysMap.set(toy.id, toy));
  
        // Update the BehaviorSubject with the current map values
        this.toysSubject.next(Array.from(this.toysMap.values()));
  
        // Check if there are more pages to load
        if (response.content.length >0) {  // Access the 'last' field to see if more pages exist
          this.loadToysRecursively(pageNumber + 1, pageSize);
        } else {
          this.toysLoaded = true; // All pages are loaded
        }
      },
      error => {
        this.toysLoaded = false;
        console.error('Error fetching toys', error);
      }
    );
  }
  
  
  

  downloadExcelFile() {
    return this.http.get(this.apiUrl+ 'toys' + "/download-excel", {
      responseType: 'blob', // Important to process binary data
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    });
  }

  getToyById(id: number): Observable<Toy | undefined> {
    return new Observable(observer => {
      // Check if toys are already loaded
      if (this.toysMap.get(id)) {
        observer.next(this.toysMap.get(id));
        observer.complete();
      } else {
        // If toys are not loaded, load them first
        this.catalogService.getCatalogItem(id).subscribe(val=>{
          this.toysMap.set(id, val);
          observer.next(this.toysMap.get(id));
          observer.complete();
        })
      }
    });
  }

  public getToyByIdNonObj(id: number): Toy {
    if (!this.toysMap.get(id)) {
      this.getToyById(id).subscribe(val=>{
        this.toysMap.set(val.id, val);
      })
    }
    return this.toysMap.get(id);
  }

  // createToy(toy: Toy): Observable<Toy> {
  //   return this.http.post<Toy>(`${this.apiUrl}toys/`, toy);
  // }

  createToy(toy: Toy): Observable<Toy> {
    return this.http.post<Toy>(`${this.apiUrl}toys/`, toy).pipe(
      tap(newToy => {
        // If toys are loaded, add the new toy to the map and emit the updated list
        if (this.toysLoaded) {
          this.toysMap.set(newToy.id, newToy);
          const updatedToys = Array.from(this.toysMap.values());
          this.toysSubject.next(updatedToys);
        } else {
          // If toys are not loaded, mark them as loaded and fetch all toys again
          this.toysLoaded = true;
          this.getAllToys().subscribe();
        }
      })
    );
  }

  updateToy(toy: Toy): Observable<Toy> {
    return this.http.put<Toy>(`${this.apiUrl}toys/${toy.id}`, toy);
  }

  deleteAllToys(secret: string)
  {
    return this.http.delete<void>(`${this.apiUrl}toys/all/${secret}`);
  }

  // deleteToy(toyId: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}toys/${toyId}`);
  // }

  deleteToy(toyId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}toys/${toyId}`).pipe(
      tap(() => {
        // If toys are loaded, remove the deleted toy from the map and emit the updated list
        if (this.toysLoaded) {
          this.toysMap.delete(toyId);
          const updatedToys = Array.from(this.toysMap.values());
          this.toysSubject.next(updatedToys);
        } else {
          // If toys are not loaded, mark them as loaded and fetch all toys again
          this.toysLoaded = true;
          this.getAllToys().subscribe();
        }
      })
    );
  }

  refreshToys() {
    this.toysLoaded = false;
    return this.getAllToys();
  }
}
