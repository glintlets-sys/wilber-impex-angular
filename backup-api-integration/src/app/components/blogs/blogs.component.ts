import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlogDataService } from 'src/app/services/blog-data.service';
import { Blog } from 'src/app/services/blog-data.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent {
  showFullStory: boolean[] = [];
  
  blogs: Blog[] = [];

  breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Blogs', url: '/blogs', }
  ];

  constructor(private router:Router, private blogDataService: BlogDataService) { }

  ngOnInit(): void {
    this.blogDataService.getAllBlogs().subscribe(blogs=>{
    this.blogs = blogs;
   });
  }
  toggleFullStory(num: number) {
    this.showFullStory[num] = !this.showFullStory[num];
  }

  navigateToBlog(blogId: number) {
    this.router.navigate(['blog', blogId]); // Navigate to the 'blog' route with the specified 'blogId'
  }

}
