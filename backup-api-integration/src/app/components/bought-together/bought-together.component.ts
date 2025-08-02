import { Component, OnInit } from '@angular/core';
import { BoughtTogether } from 'src/app/services/boughtTogether/bought-together';
import { BoughtTogetherService } from 'src/app/services/boughtTogetherService/bought-together.service';
import { ToyService } from 'src/app/services/toy.service';
import { environment } from 'src/environments/environment';
import { AddtoysboughtComponent } from './addtoysbought/addtoysbought.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bought-together',
  templateUrl: './bought-together.component.html',
  styleUrls: ['./bought-together.component.scss']
})
export class BoughtTogetherComponent implements OnInit {

  bought_together: BoughtTogether[];
  tableSize = environment.tableSize;
  page: number = 1;
  count: number = 0;
  static_bought_together: BoughtTogether[];
  // searchToy = ''

  constructor(private boughtTogetherService: BoughtTogetherService,
    private toyService: ToyService, private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getBoughtTogether();
  }

  getBoughtTogether() {
    this.boughtTogetherService.getAllBoughtTogether().subscribe((val) => {
      this.bought_together = val;
      this.count = this.bought_together?.length;
    });
  }

  openAddEditBoughtTogether(item) {
    const modalRef = this.modalService.open(AddtoysboughtComponent, {
      size: "xl",
    });
    if (item) {
      modalRef.componentInstance.editBoughtTogetherData = item;
    }
    modalRef.result.then(() => {
      this.getBoughtTogether();
    })
  }

  deleteBoughtTogether(id) {
    this.boughtTogetherService.deleteBoughtTogether(id).subscribe(() => {
      this.boughtTogetherService.clearCache();
      this.getBoughtTogether();
    }, error => {
      console.error('Error deleting bought together item:', error);
    });
  }
  
  // filterData(): void {
  //   this.bought_together = this.static_bought_together.filter(toy =>
  //     toy.name.toLowerCase().includes(this.searchToy.toLowerCase())
  //   );
  // }

}
