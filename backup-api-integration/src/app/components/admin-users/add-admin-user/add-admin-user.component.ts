import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-admin-user',
  templateUrl: './add-admin-user.component.html',
  styleUrls: ['./add-admin-user.component.scss']
})
export class AddAdminUserComponent implements OnInit {
  @Input() editUser: any;
  @Input() exist_admin_user: any
  public selected_user: any = { id: 0, user_name: '', role: { id: '', role_name: '' } };
  public all_user: any[] = [];
  public user_role: any[] = [];
  tempUser: any[] = []
  userName: string = ''

  constructor(public modal: NgbActiveModal, public user_service: UserService) { }

  ngOnInit(): void {
    this.getUserRole();
    if (this.editUser !== undefined) {
      this.loadData();
      this.all_user = this.exist_admin_user
    }
    else {
      this.loadUserData()
    }
  }

  loadUserData() {
    this.getAllUser();
  }

  loadData() {
    const temp_user_name = this.editUser.firstName == null ? "" : this.editUser.firstName;
    this.selected_user = {
      id: this.editUser.id,
      user_name: temp_user_name + ' (' + this.editUser.username + ')',
      role: { id: this.editUser.id, role_name: this.editUser.role }
    };
  }

  getAllUser() {
    this.user_service.getUsers().subscribe(val => {
      this.tempUser = val;
      this.tempUser.forEach(user => {
        const usernameExists = this.exist_admin_user.some(existuser => existuser.username === user.username);
        if (!usernameExists) {
          this.all_user.push(user);
        }
      });
    });
  }

  getUserRole() {
    this.user_service.getUsersRole().subscribe(val => {
      this.user_role = val.map((element, index) => ({ id: index + 1, role: element }));
    });
  }

  changeUser(event: any): void {
    const selectedUser = this.all_user.find(user => user?.id == event);
    if (selectedUser) {
      this.userName = selectedUser.username;
    } else {
      console.log('User not found');
    }
  }

  saveUser() {
    const user_name = this.editUser !== undefined ? this.selected_user.user_name.match(/\(([^)]+)\)/)[1] : this.userName;
    this.user_service.updateUserRole(user_name, this.selected_user.role.role_name).subscribe(val => {
      this.modal.close()
    })
  }

}
