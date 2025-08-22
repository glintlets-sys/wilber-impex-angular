import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../shared-services/authentication.service';
import { UserService } from '../../shared-services/user.service';
import { RolePermissionsService } from '../../shared-services/role-permissions.service';
import { AddEditAdminUserComponent } from './add-edit-admin-user/add-edit-admin-user.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AddEditAdminUserComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  adminUsers: any[] = [];
  selectedUser: any = null;
  showAddEditModal: boolean = false;
  editMode: boolean = false;
  tableSize = 10;
  page: number = 1;
  count: number = 0;
  isLoading: boolean = false;
  availableRoles: string[] = [];

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private rolePermissionsService: RolePermissionsService
  ) { }

  ngOnInit() {
    this.loadAvailableRoles();
    this.loadAdminUsers();
  }

  loadAvailableRoles() {
    this.userService.getUsersRole().subscribe({
      next: (val) => {
        const rolesArray = Array.isArray(val) ? val : [];
        if (rolesArray.length === 0) {
          // Fallback to default roles
          this.availableRoles = ['USER', 'ADMIN', 'SUPER_ADMIN', 'ACCOUNTS'];
        } else {
          this.availableRoles = rolesArray;
        }
        console.log('✅ [AdminUsers] Available roles:', this.availableRoles);
      },
      error: (error) => {
        console.error('❌ [AdminUsers] Error loading roles:', error);
        // Fallback to default roles
        this.availableRoles = ['USER', 'ADMIN', 'SUPER_ADMIN', 'ACCOUNTS'];
      }
    });
  }

  loadAdminUsers() {
    this.isLoading = true;
    this.authService.getAdminUsers().subscribe({
      next: (data) => {
        // Ensure data is an array
        this.adminUsers = Array.isArray(data) ? data : [];
        this.count = this.adminUsers.length;
        this.isLoading = false;
        console.log('✅ [AdminUsers] Loaded admin users:', this.adminUsers);
        
        // Debug: Check role data structure
        if (this.adminUsers.length > 0) {
          console.log('🔍 [AdminUsers] First user role data:', {
            user: this.adminUsers[0],
            role: this.adminUsers[0].role,
            roleType: typeof this.adminUsers[0].role,
            hasRole: 'role' in this.adminUsers[0]
          });
        }
      },
      error: (error) => {
        console.error('❌ [AdminUsers] Error loading admin users:', error);
        this.adminUsers = [];
        this.count = 0;
        this.isLoading = false;
      }
    });
  }

  // Removed selectUser method as it's no longer needed

  openAddUserModal() {
    this.editMode = false;
    this.selectedUser = null;
    this.showAddEditModal = true;
  }

  openEditUserModal(user: any) {
    this.selectedUser = user;
    this.editMode = true;
    this.showAddEditModal = true;
  }

  closeModal() {
    this.showAddEditModal = false;
    this.selectedUser = null;
    this.editMode = false;
  }

  onSaveUser() {
    this.loadAdminUsers(); // Refresh the list
    this.closeModal();
  }

  deleteUser(user: any) {
    if (confirm(`Are you sure you want to remove admin privileges for ${user.firstName || user.username}?`)) {
      // This would typically call an API to remove admin role
      console.log('🗑️ [AdminUsers] Delete user:', user);
      // For now, just refresh the list
      this.loadAdminUsers();
    }
  }

  getRoleBadgeClass(role: string): string {
    // Use role permissions service to get consistent styling
    const roleInfo = this.rolePermissionsService.getRoleInfo(role);
    if (roleInfo) {
      // Map roles to badge colors
      switch (role) {
        case 'SUPER_ADMIN':
          return 'bg-danger';
        case 'ADMIN':
          return 'bg-primary';
        case 'STORE_MANAGER':
          return 'bg-success';
        case 'FINANCE_MANAGER':
          return 'bg-warning';
        case 'ACCOUNTS':
          return 'bg-info';
        case 'USER':
          return 'bg-secondary';
        default:
          return 'bg-warning';
      }
    }
    return 'bg-warning'; // Default for unknown roles
  }
}
