import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../shared-services/toaster.service';
import { ToastType } from '../../shared-services/toaster';
import { BlogDataService, Blog } from '../../shared-services/blog-data.service';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-blogs.component.html',
  styleUrls: ['./admin-blogs.component.scss']
})
export class AdminBlogsComponent implements OnInit {
  public blogs: Blog[] = [];
  public filteredBlogs: Blog[] = [];
  public searchBlog: string = '';
  public loading: boolean = false;
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public Math = Math; // For use in template
  
  // Add/Edit Blog Modal
  public showBlogModal: boolean = false;
  public editingBlog: Blog | null = null;
  public newBlog: Blog = {
    id: 0,
    title: '',
    imageUrl: '',
    content: '',
    shortContent: '',
    author: '',
    authorTitle: '',
    authorPic: '',
    readTime: 0,
    externalUrl: '',
    publishDate: new Date().toISOString().split('T')[0],
    category: '',
    tags: []
  };

  constructor(
    private router: Router,
    private toasterService: ToasterService,
    private blogDataService: BlogDataService
  ) { }

  ngOnInit(): void {
    console.log('🔄 [AdminBlogs] Component initialized');
    this.loadBlogs();
  }

  public loadBlogs(): void {
    console.log('🔄 [AdminBlogs] Loading blogs...');
    this.loading = true;
    
    this.blogDataService.getAllBlogs().subscribe({
      next: (blogs) => {
        console.log('🔄 [AdminBlogs] Received blogs:', blogs);
        this.blogs = blogs;
        this.filteredBlogs = [...this.blogs];
        this.totalItems = this.filteredBlogs.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ [AdminBlogs] Error loading blogs:', error);
        this.toasterService.showToast('Failed to load blogs', ToastType.Error);
        this.loading = false;
        // Fallback to empty array
        this.blogs = [];
        this.filteredBlogs = [];
        this.totalItems = 0;
      }
    });
  }

  public filterData(): void {
    if (!this.searchBlog.trim()) {
      this.filteredBlogs = [...this.blogs];
    } else {
      this.filteredBlogs = this.blogs.filter(blog =>
        blog.title?.toLowerCase().includes(this.searchBlog.toLowerCase()) ||
        blog.author?.toLowerCase().includes(this.searchBlog.toLowerCase()) ||
        blog.category?.toLowerCase().includes(this.searchBlog.toLowerCase())
      );
    }
    this.totalItems = this.filteredBlogs.length;
    this.currentPage = 1;
  }

  public get paginatedBlogs(): Blog[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredBlogs.slice(startIndex, endIndex);
  }

  public get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
  }

  public addBlog(): void {
    this.editingBlog = null;
    this.newBlog = {
      id: 0,
      title: '',
      imageUrl: '',
      content: '',
      shortContent: '',
      author: '',
      authorTitle: '',
      authorPic: '',
      readTime: 0,
      externalUrl: '',
      publishDate: new Date().toISOString().split('T')[0],
      category: '',
      tags: []
    };
    this.showBlogModal = true;
  }

  public editBlog(blog: Blog): void {
    this.editingBlog = { ...blog };
    this.newBlog = { ...blog };
    this.showBlogModal = true;
  }

  public deleteBlog(blog: Blog): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      // TODO: Implement delete functionality
      this.toasterService.showToast('Blog deleted successfully', ToastType.Success);
      this.loadBlogs(); // Reload the list
    }
  }

  public saveBlog(): void {
    if (!this.newBlog.title || !this.newBlog.content) {
      this.toasterService.showToast('Please fill in all required fields', ToastType.Warn);
      return;
    }

    if (this.editingBlog) {
      // Update existing blog
      // TODO: Implement update functionality
      this.toasterService.showToast('Blog updated successfully', ToastType.Success);
    } else {
      // Create new blog
      // TODO: Implement create functionality
      this.toasterService.showToast('Blog created successfully', ToastType.Success);
    }
    
    this.closeBlogModal();
    this.loadBlogs(); // Reload the list
  }

  public closeBlogModal(): void {
    this.showBlogModal = false;
    this.editingBlog = null;
    this.newBlog = {
      id: 0,
      title: '',
      imageUrl: '',
      content: '',
      shortContent: '',
      author: '',
      authorTitle: '',
      authorPic: '',
      readTime: 0,
      externalUrl: '',
      publishDate: new Date().toISOString().split('T')[0],
      category: '',
      tags: []
    };
  }

  public addTag(): void {
    const tagInput = document.getElementById('tagInput') as HTMLInputElement;
    if (tagInput && tagInput.value.trim()) {
      if (!this.newBlog.tags) {
        this.newBlog.tags = [];
      }
      this.newBlog.tags.push(tagInput.value.trim());
      tagInput.value = '';
    }
  }

  public removeTag(tag: string): void {
    if (this.newBlog.tags) {
      this.newBlog.tags = this.newBlog.tags.filter(t => t !== tag);
    }
  }

  public formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN');
  }

  public getStatusBadgeClass(blog: Blog): string {
    // You can implement status logic here
    return 'badge-success';
  }

  public getStatusText(blog: Blog): string {
    // You can implement status logic here
    return 'Published';
  }

  // Computed properties for statistics
  public get publishedCount(): number {
    return this.blogs.filter(b => b.publishDate).length;
  }

  public get externalContentCount(): number {
    return this.blogs.filter(b => b.externalUrl).length;
  }

  public get uniqueCategoriesCount(): number {
    const categories = this.blogs.map(b => b.category).filter(c => c);
    return [...new Set(categories)].length;
  }
}
