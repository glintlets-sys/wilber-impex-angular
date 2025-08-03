import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Toy } from './toy';

@Injectable({
  providedIn: 'root'
})
export class ToyService {
 
  private apiUrl: string = environment.serviceURL;
  private toysSubject: BehaviorSubject<Toy[]> = new BehaviorSubject<Toy[]>([]);
  private toysLoaded: boolean = false;
  private toysMap: Map<number, Toy> = new Map();

  constructor(private http: HttpClient) { }

  loadImagestoCMS() {
    return this.http.get<Toy[]>(`${this.apiUrl}toys/updatePhotoLinksFromS3`);
  }

  getAllToysNonPaginated(): Observable<Toy[]> {
    console.log('🔍 [TOY] Getting all toys (non-paginated)');
    if (!this.toysLoaded) {
      this.toysLoaded = true;
      this.http.get<Toy[]>(`${this.apiUrl}toys/`).subscribe({
        next: (toys) => {
          console.log('✅ [TOY] Toys loaded successfully:', toys);
          console.log('📊 [TOY] Total toys count:', toys.length);
          this.toysMap.clear();
          toys.forEach((toy: Toy) => {
            if (toy.id !== undefined) {
              this.toysMap.set(toy.id, toy);
            }
          });
          this.toysSubject.next(toys);
          this.toysLoaded = true;
        },
        error: (error) => {
          this.toysLoaded = false;
          console.error('❌ [TOY] Error fetching toys:', error);
        }
      });
    }
    return this.toysSubject.asObservable();
  }

  getAllToys(pageNumber: number = 0, pageSize: number = 10): Observable<Toy[]> {
    console.log('🔍 [TOY] Getting all toys with pagination');
    if (!this.toysLoaded) {
      this.loadToysRecursively(pageNumber, pageSize);
    }
    return this.toysSubject.asObservable();
  }
  
  private loadToysRecursively(pageNumber: number, pageSize: number): void {
    console.log(`🔍 [TOY] Loading toys page ${pageNumber} with size ${pageSize}`);
    this.http.get<any>(`${this.apiUrl}toys/pagination`, {
      params: {
        page: pageNumber.toString(),
        size: pageSize.toString()
      }
    }).subscribe({
      next: (response) => {
        const toys = response.content;
        console.log(`✅ [TOY] Page ${pageNumber} loaded with ${toys.length} toys`);
        toys.forEach((toy: Toy) => {
          if (toy.id !== undefined) {
            this.toysMap.set(toy.id, toy);
          }
        });
  
        // Update the BehaviorSubject with the current map values
        this.toysSubject.next(Array.from(this.toysMap.values()));
  
        // Check if there are more pages to load
        if (response.content.length > 0) {
          this.loadToysRecursively(pageNumber + 1, pageSize);
        } else {
          this.toysLoaded = true; // All pages are loaded
          console.log('✅ [TOY] All toys loaded successfully');
        }
      },
      error: (error) => {
        this.toysLoaded = false;
        console.error('❌ [TOY] Error fetching toys:', error);
      }
    });
  }

  downloadExcelFile() {
    return this.http.get(this.apiUrl + 'toys' + "/download-excel", {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    });
  }

  getToyById(id: number): Observable<Toy | undefined> {
    console.log(`🔍 [TOY] Getting toy by ID: ${id}`);
    return new Observable(observer => {
      // Check if toys are already loaded
      if (this.toysMap.get(id)) {
        console.log(`✅ [TOY] Toy found in cache:`, this.toysMap.get(id));
        observer.next(this.toysMap.get(id));
        observer.complete();
      } else {
        // If toys are not loaded, load them first
        console.log(`🔍 [TOY] Toy not in cache, fetching from API`);
        this.http.get<Toy>(`${this.apiUrl}toys/${id}`).subscribe({
          next: (toy) => {
            console.log(`✅ [TOY] Toy fetched from API:`, toy);
            if (toy.id !== undefined) {
              this.toysMap.set(toy.id, toy);
            }
            observer.next(this.toysMap.get(id));
            observer.complete();
          },
          error: (error) => {
            console.error(`❌ [TOY] Error fetching toy ${id}:`, error);
            observer.error(error);
          }
        });
      }
    });
  }

  public getToyByIdNonObj(id: number): Toy | undefined {
    console.log(`🔍 [TOY] Getting toy by ID (non-observable): ${id}`);
    if (!this.toysMap.get(id)) {
      console.log(`⚠️ [TOY] Toy ${id} not in cache, loading from API`);
      this.getToyById(id).subscribe({
        next: (toy) => {
          if (toy && toy.id !== undefined) {
            this.toysMap.set(toy.id, toy);
          }
        },
        error: (error) => {
          console.error(`❌ [TOY] Error loading toy ${id}:`, error);
        }
      });
    }
    return this.toysMap.get(id);
  }

  createToy(toy: Toy): Observable<Toy> {
    console.log('🔍 [TOY] Creating new toy:', toy);
    return this.http.post<Toy>(`${this.apiUrl}toys/`, toy).pipe(
      tap(newToy => {
        console.log('✅ [TOY] Toy created successfully:', newToy);
        // If toys are loaded, add the new toy to the map and emit the updated list
        if (this.toysLoaded) {
          if (newToy.id !== undefined) {
            this.toysMap.set(newToy.id, newToy);
          }
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
    console.log('🔍 [TOY] Updating toy:', toy);
    return this.http.put<Toy>(`${this.apiUrl}toys/${toy.id}`, toy);
  }

  deleteAllToys(secret: string) {
    console.log('🔍 [TOY] Deleting all toys with secret');
    return this.http.delete<void>(`${this.apiUrl}toys/all/${secret}`);
  }

  deleteToy(toyId: number): Observable<void> {
    console.log(`🔍 [TOY] Deleting toy with ID: ${toyId}`);
    return this.http.delete<void>(`${this.apiUrl}toys/${toyId}`).pipe(
      tap(() => {
        console.log(`✅ [TOY] Toy ${toyId} deleted successfully`);
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
    console.log('🔄 [TOY] Refreshing toys');
    this.toysLoaded = false;
    return this.getAllToys();
  }

  // Method to check if there's data available
  checkDataAvailability(): void {
    console.log('🔍 [TOY] Checking data availability...');
    console.log('📊 [TOY] Toys loaded:', this.toysLoaded);
    console.log('📊 [TOY] Toys in map:', this.toysMap.size);
    console.log('📊 [TOY] Current toys in subject:', this.toysSubject.value.length);
    
    if (this.toysMap.size > 0) {
      console.log('✅ [TOY] Data is available');
      console.log('📋 [TOY] Sample toys:');
      const sampleToys = Array.from(this.toysMap.values()).slice(0, 3);
      sampleToys.forEach((toy, index) => {
        console.log(`  ${index + 1}. ID: ${toy.id}, Name: ${toy.name}, Price: ${toy.price?.amount} ${toy.price?.currency}`);
      });
    } else {
      console.log('❌ [TOY] No data available');
    }
  }
} 