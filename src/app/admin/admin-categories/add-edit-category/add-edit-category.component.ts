import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../shared-services/category';
import { CategoryService } from '../../../shared-services/category.service';

@Component({
  selector: 'app-add-edit-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-category.component.html',
  styleUrl: './add-edit-category.component.scss'
})
export class AddEditCategoryComponent implements OnInit {
  @Input() editCategoryData: Category | null = null;
  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  @Output() saveCategory: EventEmitter<Category> = new EventEmitter();

  public category: Category = { 
    id: 0, 
    name: '', 
    description: '', 
    image: 'assets/images/image_empty.jpg',
    type: 'Standard'
  };

  categoryTypes: string[] = ["Standard", "Featured", "Festive", "None"];
  allCategories: Category[] = [];
  parentCategories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadParentCategories();
    
    if (this.editCategoryData) {
      this.category = { ...this.editCategoryData };
    }
  }

  loadParentCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.allCategories = categories;
        // Filter out root categories (no parent) and exclude current category if editing
        this.parentCategories = categories.filter(cat => 
          (cat.parentId === null || cat.parentId === undefined) &&
          cat.id !== this.editCategoryData?.id // Prevent circular reference
        );
        console.log('📦 [AddEditCategory] Loaded parent categories:', this.parentCategories);
      },
      error: (error) => {
        console.error('❌ [AddEditCategory] Error loading parent categories:', error);
      }
    });
  }

  onSave(): void {
    if (!this.category.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    if (!this.category.description.trim()) {
      alert('Please enter a category description');
      return;
    }

    this.saveCategory.emit(this.category);
  }

  onCancel(): void {
    this.closePopup.emit();
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.category.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('categoryImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
