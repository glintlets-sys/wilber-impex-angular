import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AddAdminUserComponent } from './add-admin-user/add-admin-user.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  adminusers: any;
  editUserPop: boolean = false
  selectedUser: any;
  tableSize = environment.tableSize;
  page: number = 1;
  count: number = 0;
  constructor(private authService: AuthenticationService, private modalService: NgbModal) { }

  ngOnInit() {
    this.laodData()
  }

  laodData() {
    this.authService.getAdminUsers().subscribe((data) => {
      this.adminusers = data;
      this.count=this.adminusers?.length;
    });
  }

  doTrueForEdit() {
    this.editUserPop = true
  }

  openAddEditUser(userAction: string) {
    const modalRef = this.modalService.open(AddAdminUserComponent, {
      size: "xl",
    });

    modalRef.componentInstance.exist_admin_user = this.adminusers;
    if (userAction == "editUser") {
      modalRef.componentInstance.editUser = this.selectedUser;
    }
    modalRef.result.then(() => {
      this.editUserPop = false
      this.laodData()
    })
  }

}
