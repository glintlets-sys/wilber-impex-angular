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
    if (!this.toysLoaded) {
      this.toysLoaded = true;
      this.http.get<Toy[]>(`${this.apiUrl}toys/`).subscribe({
        next: (toys) => {
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
          console.error('Error fetching toys:', error);
        }
      });
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
    }).subscribe({
      next: (response) => {
        const toys = response.content;
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
        }
      },
      error: (error) => {
        this.toysLoaded = false;
        console.error('Error fetching toys:', error);
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
    return new Observable(observer => {
      // Check if toys are already loaded
      if (this.toysMap.get(id)) {
        observer.next(this.toysMap.get(id));
        observer.complete();
      } else {
        // If toys are not loaded, load them first
        this.http.get<Toy>(`${this.apiUrl}toys/${id}`).subscribe({
          next: (toy) => {
            if (toy.id !== undefined) {
              this.toysMap.set(toy.id, toy);
            }
            observer.next(this.toysMap.get(id));
            observer.complete();
          },
          error: (error) => {
            console.error(`Error fetching toy ${id}:`, error);
            observer.error(error);
          }
        });
      }
    });
  }

  public getToyByIdNonObj(id: number): Toy | undefined {
    if (!this.toysMap.get(id)) {
      this.getToyById(id).subscribe({
        next: (toy) => {
          if (toy && toy.id !== undefined) {
            this.toysMap.set(toy.id, toy);
          }
        },
        error: (error) => {
          console.error(`Error loading toy ${id}:`, error);
        }
      });
    }
    return this.toysMap.get(id);
  }

  createToy(toy: Toy): Observable<Toy> {
    return this.http.post<Toy>(`${this.apiUrl}toys/`, toy).pipe(
      tap(newToy => {
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
    return this.http.put<Toy>(`${this.apiUrl}toys/${toy.id}`, toy);
  }

  deleteAllToys(secret: string) {
    return this.http.delete<void>(`${this.apiUrl}toys/all/${secret}`);
  }

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