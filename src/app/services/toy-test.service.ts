import { Injectable } from '@angular/core';
import { ToyService } from './toy.service';

@Injectable({
  providedIn: 'root'
})
export class ToyTestService {

  constructor(private toyService: ToyService) { 
    // Expose the toy service globally for manual testing
    (window as any).toyService = this.toyService;
    (window as any).toyTestService = this;
    console.log('🧪 [TOY TEST] Toy service exposed globally as window.toyService');
    console.log('🧪 [TOY TEST] Toy test service exposed globally as window.toyTestService');
  }

  // Method to test toy service and check data availability
  testToyService(): void {
    console.log('🧪 [TOY TEST] Starting toy service test...');
    
    // Test 1: Check data availability before loading
    console.log('📋 [TOY TEST] Test 1: Checking initial data availability');
    this.toyService.checkDataAvailability();
    
    // Test 2: Load all toys (non-paginated)
    console.log('📋 [TOY TEST] Test 2: Loading all toys (non-paginated)');
    this.toyService.getAllToysNonPaginated().subscribe({
      next: (toys) => {
        console.log('✅ [TOY TEST] Non-paginated toys loaded:', toys.length);
        if (toys.length > 0) {
          console.log('📋 [TOY TEST] Sample toy data:');
          toys.slice(0, 3).forEach((toy, index) => {
            console.log(`  ${index + 1}. ID: ${toy.id}, Name: ${toy.name}, Brand: ${toy.brand}, Price: ${toy.price?.amount} ${toy.price?.currency}`);
          });
        }
      },
      error: (error) => {
        console.error('❌ [TOY TEST] Error loading non-paginated toys:', error);
      }
    });
    
    // Test 3: Load toys with pagination
    console.log('📋 [TOY TEST] Test 3: Loading toys with pagination');
    this.toyService.getAllToys(0, 5).subscribe({
      next: (toys) => {
        console.log('✅ [TOY TEST] Paginated toys loaded:', toys.length);
        if (toys.length > 0) {
          console.log('📋 [TOY TEST] Sample paginated toy data:');
          toys.slice(0, 3).forEach((toy, index) => {
            console.log(`  ${index + 1}. ID: ${toy.id}, Name: ${toy.name}, Brand: ${toy.brand}, Price: ${toy.price?.amount} ${toy.price?.currency}`);
          });
        }
      },
      error: (error) => {
        console.error('❌ [TOY TEST] Error loading paginated toys:', error);
      }
    });
    
    // Test 4: Check data availability after loading
    setTimeout(() => {
      console.log('📋 [TOY TEST] Test 4: Checking data availability after loading');
      this.toyService.checkDataAvailability();
    }, 2000);
  }

  // Method to test getting a specific toy by ID
  testGetToyById(toyId: number): void {
    console.log(`🧪 [TOY TEST] Testing getToyById for ID: ${toyId}`);
    this.toyService.getToyById(toyId).subscribe({
      next: (toy) => {
        if (toy) {
          console.log('✅ [TOY TEST] Toy found:', toy);
          console.log(`  ID: ${toy.id}`);
          console.log(`  Name: ${toy.name}`);
          console.log(`  Brand: ${toy.brand}`);
          console.log(`  Price: ${toy.price?.amount} ${toy.price?.currency}`);
          console.log(`  Summary: ${toy.summary}`);
        } else {
          console.log('❌ [TOY TEST] Toy not found');
        }
      },
      error: (error) => {
        console.error(`❌ [TOY TEST] Error getting toy ${toyId}:`, error);
      }
    });
  }

  // Method to test getting a toy by ID (non-observable)
  testGetToyByIdNonObj(toyId: number): void {
    console.log(`🧪 [TOY TEST] Testing getToyByIdNonObj for ID: ${toyId}`);
    const toy = this.toyService.getToyByIdNonObj(toyId);
    if (toy) {
      console.log('✅ [TOY TEST] Toy found (non-observable):', toy);
      console.log(`  ID: ${toy.id}`);
      console.log(`  Name: ${toy.name}`);
      console.log(`  Brand: ${toy.brand}`);
      console.log(`  Price: ${toy.price?.amount} ${toy.price?.currency}`);
    } else {
      console.log('❌ [TOY TEST] Toy not found (non-observable)');
    }
  }

  // Method to manually test toy service from browser console
  manualTest(): void {
    console.log('🧪 [TOY TEST] Manual test started');
    console.log('📋 [TOY TEST] Available methods:');
    console.log('  - toyTestService.testToyService()');
    console.log('  - toyTestService.testGetToyById(id)');
    console.log('  - toyTestService.testGetToyByIdNonObj(id)');
    console.log('  - toyService.checkDataAvailability()');
    console.log('  - toyService.getAllToysNonPaginated()');
    console.log('  - toyService.getAllToys(page, size)');
    
    // Run the full test
    this.testToyService();
  }
} 