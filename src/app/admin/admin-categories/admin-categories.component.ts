import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../shared-services/category.service';
import { Category } from '../../shared-services/category';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AddEditCategoryComponent],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss'
})
export class AdminCategoriesComponent implements OnInit, OnDestroy {
  // Categories from backend
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchTerm = '';
  
  private subscriptions: Subscription[] = [];
  
  // Loading states
  isLoading = false;

  // Pagination properties
  tableSize = 10;
  page = 1;
  count = 0;

  // Modal states
  showAddEditModal = false;
  selectedCategory: Category | null = null;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategoriesFromBackend();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCategoriesFromBackend(): void {
    this.isLoading = true;
    
    const sub = this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        console.log('📦 [AdminCategories] Loaded categories from backend:', categories);
        this.categories = categories;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [AdminCategories] Error loading categories from backend:', error);
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(sub);
  }

  applyFilters(): void {
    this.filteredCategories = this.categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           (category.description && category.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
    this.count = this.filteredCategories.length;
  }

  filterData(): void {
    this.applyFilters();
  }

  getParentCategory(category: Category): string {
    if (category.parentId) {
      const parentCategory = this.categories.find(c => c.id === category.parentId);
      return parentCategory ? parentCategory.name : '';
    }
    return 'Root Category';
  }

  getTypeBadgeClass(type: string | undefined): string {
    switch (type?.toLowerCase()) {
      case 'featured':
        return 'bg-warning text-dark';
      case 'festive':
        return 'bg-success text-white';
      case 'none':
        return 'bg-secondary text-white';
      case 'standard':
      default:
        return 'bg-primary text-white';
    }
  }

  refreshCategories(): void {
    this.loadCategoriesFromBackend();
  }

  // Modal methods
  openAddEditPopupForCategory(category: Category | string): void {
    if (typeof category === 'string') {
      // Add new category - create a new category object
      const newCategory: Category = {
        id: 0, // Will be assigned by backend
        name: '',
        description: '',
        image: 'assets/images/placeholder-product.png',
        type: 'Standard'
      };
      this.selectedCategory = newCategory;
    } else {
      // Edit existing category
      this.selectedCategory = { ...category }; // Create a copy to avoid direct modification
    }
    this.showAddEditModal = true;
  }

  closeModal(): void {
    this.showAddEditModal = false;
    this.selectedCategory = null;
  }

  onSaveCategory(category: Category): void {
    console.log('💾 [AdminCategories] Saving category:', category);
    
    if (category.id === 0) {
      // Create new category
      const sub = this.categoryService.createCategory(category).subscribe({
        next: (createdCategory) => {
          console.log('✅ [AdminCategories] Category created successfully:', createdCategory);
          this.loadCategoriesFromBackend(); // Reload to get the new category with proper ID
          this.closeModal();
          alert('Category created successfully!');
        },
        error: (error) => {
          console.error('❌ [AdminCategories] Error creating category:', error);
          alert('Error creating category. Please try again.');
        }
      });
      this.subscriptions.push(sub);
    } else {
      // Update existing category
      const sub = this.categoryService.updateCategory(category).subscribe({
        next: (updatedCategory) => {
          console.log('✅ [AdminCategories] Category updated successfully:', updatedCategory);
          this.loadCategoriesFromBackend(); // Reload to get updated data
          this.closeModal();
          alert('Category updated successfully!');
        },
        error: (error) => {
          console.error('❌ [AdminCategories] Error updating category:', error);
          alert('Error updating category. Please try again.');
        }
      });
      this.subscriptions.push(sub);
    }
  }

  deleteCategory(categoryId: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      console.log('🗑️ [AdminCategories] Deleting category:', categoryId);
      
      const sub = this.categoryService.deleteCategory(categoryId).subscribe({
        next: () => {
          console.log('✅ [AdminCategories] Category deleted successfully');
          this.loadCategoriesFromBackend(); // Reload to get updated data
          alert('Category deleted successfully!');
        },
        error: (error) => {
          console.error('❌ [AdminCategories] Error deleting category:', error);
          alert('Error deleting category. Please try again.');
        }
      });
      this.subscriptions.push(sub);
    }
  }
}