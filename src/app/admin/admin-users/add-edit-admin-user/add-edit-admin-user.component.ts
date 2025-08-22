import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared-services/user.service';

@Component({
  selector: 'app-add-edit-admin-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-admin-user.component.html',
  styleUrl: './add-edit-admin-user.component.scss'
})
export class AddEditAdminUserComponent implements OnInit {
  @Input() editUser: any = null;
  @Input() existingAdminUsers: any[] = [];
  @Output() closePopup = new EventEmitter<void>();
  @Output() saveUser = new EventEmitter<void>();

  selectedUser: any = { id: 0, user_name: '', role: { id: '', role_name: '' } };
  allUsers: any[] = [];
  userRoles: any[] = [];
  tempUsers: any[] = [];
  isLoading: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserRoles();
    if (this.editUser) {
      this.loadEditData();
    } else {
      this.loadUserData();
    }
  }

  loadUserData() {
    this.getAllUsers();
  }

  loadEditData() {
    // For edit mode, we only need to set the current role
    this.selectedUser = {
      id: this.editUser.id,
      user_name: this.editUser.firstName || this.editUser.username,
      role: { id: this.editUser.id, role_name: this.editUser.role }
    };
  }

  getAllUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (val) => {
        // Ensure val is an array
        this.tempUsers = Array.isArray(val) ? val : [];
        this.tempUsers.forEach(user => {
          const usernameExists = this.existingAdminUsers.some(existUser => existUser.username === user.username);
          if (!usernameExists) {
            this.allUsers.push(user);
          }
        });
        this.isLoading = false;
        console.log('✅ [AddEditAdminUser] Loaded users:', this.allUsers);
      },
      error: (error) => {
        console.error('❌ [AddEditAdminUser] Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  loadUserRoles() {
    console.log('🔍 [AddEditAdminUser] Loading user roles...');
    this.userService.getUsersRole().subscribe({
      next: (val) => {
        console.log('🔍 [AddEditAdminUser] Raw roles response:', val);
        // Ensure val is an array before mapping
        const rolesArray = Array.isArray(val) ? val : [];
        console.log('🔍 [AddEditAdminUser] Roles array:', rolesArray);
        
        // If no roles from API, use default roles
        if (rolesArray.length === 0) {
          console.log('⚠️ [AddEditAdminUser] No roles from API, using default roles');
          this.userRoles = [
            { id: 1, role: 'USER' },
            { id: 2, role: 'ADMIN' },
            { id: 3, role: 'SUPER_ADMIN' }
          ];
        } else {
          this.userRoles = rolesArray.map((element, index) => ({ id: index + 1, role: element }));
        }
        
        console.log('✅ [AddEditAdminUser] Loaded user roles:', this.userRoles);
      },
      error: (error) => {
        console.error('❌ [AddEditAdminUser] Error loading user roles:', error);
        // Fallback to default roles on error
        console.log('⚠️ [AddEditAdminUser] Using fallback roles due to error');
        this.userRoles = [
          { id: 1, role: 'USER' },
          { id: 2, role: 'ADMIN' },
          { id: 3, role: 'SUPER_ADMIN' }
        ];
      }
    });
  }

  changeUser(event: any): void {
    const selectedUser = this.allUsers.find(user => user?.id == event);
    if (selectedUser) {
      // Update the selectedUser object directly
      this.selectedUser.id = selectedUser.id;
      this.selectedUser.user_name = selectedUser.firstName || selectedUser.username;
      this.selectedUser.role.role_name = ''; // Reset role when user changes
      console.log('✅ [AddEditAdminUser] Selected user:', selectedUser);
    } else {
      console.log('⚠️ [AddEditAdminUser] User not found');
    }
  }

  saveUserData() {
    console.log('🔍 [AddEditAdminUser] saveUserData called');
    console.log('🔍 [AddEditAdminUser] editUser:', this.editUser);
    console.log('🔍 [AddEditAdminUser] selectedUser:', this.selectedUser);
    console.log('🔍 [AddEditAdminUser] allUsers:', this.allUsers);

    let userName: string;

    if (this.editUser) {
      // Edit mode: use the editUser's username
      userName = this.editUser.username;
      console.log('🔍 [AddEditAdminUser] Edit mode - using username:', userName);
      
      // Validate that we have a valid user to edit
      if (!userName) {
        alert('Invalid user data. Please try again.');
        return;
      }
    } else {
      // Add mode: use the selected user's ID to find the username
      if (!this.selectedUser.id) {
        alert('Please select a user.');
        return;
      }
      
      console.log('🔍 [AddEditAdminUser] Looking for user with ID:', this.selectedUser.id);
      console.log('🔍 [AddEditAdminUser] Available users:', this.allUsers.map(u => ({ id: u.id, username: u.username })));
      
      const selectedUser = this.allUsers.find(user => user.id == this.selectedUser.id);
      console.log('🔍 [AddEditAdminUser] Found user:', selectedUser);
      
      if (!selectedUser) {
        alert('Selected user not found. Please try again.');
        return;
      }
      
      userName = selectedUser.username;
      console.log('🔍 [AddEditAdminUser] Add mode - using username:', userName);
    }

    // Validate that a role is selected
    if (!this.selectedUser.role.role_name) {
      alert('Please select a role for the user.');
      return;
    }

    console.log('🔍 [AddEditAdminUser] Final userName:', userName);
    console.log('🔍 [AddEditAdminUser] Final role:', this.selectedUser.role.role_name);

    this.isLoading = true;
    this.userService.updateUserRole(userName, this.selectedUser.role.role_name).subscribe({
      next: (val) => {
        console.log('✅ [AddEditAdminUser] User role updated successfully:', val);
        this.isLoading = false;
        this.saveUser.emit();
      },
      error: (error) => {
        console.error('❌ [AddEditAdminUser] Error updating user role:', error);
        this.isLoading = false;
        alert('Error updating user role. Please try again.');
      }
    });
  }

  onCancel() {
    this.closePopup.emit();
  }
}

