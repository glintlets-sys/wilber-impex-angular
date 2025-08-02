import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog, BlogDataService } from 'src/app/services/blog-data.service';
import { RecommendationsTsService } from 'src/app/services/recommendations.ts.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
 // @Input() blog: Blog;

  blogId: number;
  blog: Blog;
  blogRecommendations: Blog[];

  breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Blogs', url: '/blogs', },
    { label: 'blog'}
  ];

  updateBreadcrumbLabel(targetLabel: string, newTitle: string) {
    const breadcrumbItem = this.breadcrumbItems.find(item => item.label === targetLabel);
    if (breadcrumbItem) {
        breadcrumbItem.label = newTitle.split(":")[0].substring(0,90);
    }
  }

  constructor(private router: Router, private recommendations: RecommendationsTsService,private route: ActivatedRoute, private blogDataService: BlogDataService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.blogId = +params['id']; // Get the blogId from the route parameters and convert it to a number
      this.blogDataService.getBlogById(this.blogId).subscribe(blog=>{
        this.blog = blog;
        this.updateBreadcrumbLabel("blog", this.blog.title)
      });
      this.recommendations.getRecommendedBlogs(this.blogId).subscribe(val=>{
        this.blogRecommendations = val;
      })
    });



  }

  navigateToBlog(blogId: number) {
    this.router.navigate(['blog', blogId]); // Navigate to the 'blog' route with the specified 'blogId'
  }


}

