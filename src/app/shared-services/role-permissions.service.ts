import { Injectable } from '@angular/core';

export interface RolePermissions {
  [key: string]: {
    name: string;
    permissions: string[];
    description: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RolePermissionsService {

  // Define role permissions based on the image requirements
  private rolePermissions: RolePermissions = {
    'SUPER_ADMIN': {
      name: 'Super Admin',
      permissions: [
        'dashboard',
        'manage_users',
        'products',
        'categories',
        'pricing',
        'discounts',
        'orders',
        'stock_management',
        'customers',
        'content_management',
        'blogs',
        'recommendations',
        'settings',
        'access_control'
      ],
      description: 'Full access to all system features and user management'
    },
    'ADMIN': {
      name: 'Admin',
      permissions: [
        'dashboard',
        'products',
        'categories',
        'pricing',
        'discounts',
        'orders',
        'customers',
        'content_management',
        'blogs',
        'recommendations',
        'settings'
      ],
      description: 'Access to products, pricing, discounts, and general management'
    },
    'STORE_MANAGER': {
      name: 'Store Manager',
      permissions: [
        'dashboard',
        'orders',
        'stock_management',
        'customers'
      ],
      description: 'Operational access for store management, stock, and orders'
    },
    'FINANCE_MANAGER': {
      name: 'Finance Manager',
      permissions: [
        'dashboard',
        'pricing',
        'discounts',
        'orders',
        'customers',
        'tax_information'
      ],
      description: 'Access to financial information, pricing, and tax data'
    },
    'ACCOUNTS': {
      name: 'Accounts',
      permissions: [
        'dashboard',
        'orders',
        'customers',
        'tax_information'
      ],
      description: 'Access to order processing and customer accounts'
    },
    'USER': {
      name: 'User',
      permissions: [
        'dashboard'
      ],
      description: 'Basic user access with limited functionality'
    }
  };

  constructor() { }

  /**
   * Get all available roles
   */
  getAvailableRoles(): string[] {
    return Object.keys(this.rolePermissions);
  }

  /**
   * Get role information
   */
  getRoleInfo(role: string): any {
    return this.rolePermissions[role] || null;
  }

  /**
   * Check if a user with a specific role has permission for a feature
   */
  hasPermission(userRole: string, permission: string): boolean {
    if (!userRole || !permission) {
      return false;
    }

    const roleInfo = this.rolePermissions[userRole];
    if (!roleInfo) {
      return false;
    }

    return roleInfo.permissions.includes(permission);
  }

  /**
   * Get all permissions for a specific role
   */
  getRolePermissions(role: string): string[] {
    const roleInfo = this.rolePermissions[role];
    return roleInfo ? roleInfo.permissions : [];
  }

  /**
   * Check if user can access navigation section
   */
  canAccessSection(userRole: string, section: string): boolean {
    const sectionPermissions: { [key: string]: string } = {
      'dashboard': 'dashboard',
      'products': 'products',
      'categories': 'categories',
      'orders': 'orders',
      'stock': 'stock_management',
      'customers': 'customers',
      'content': 'content_management',
      'settings': 'settings',
      'admin-users': 'manage_users'
    };

    const requiredPermission = sectionPermissions[section];
    if (!requiredPermission) {
      return false;
    }

    return this.hasPermission(userRole, requiredPermission);
  }

  /**
   * Get accessible navigation sections for a role
   */
  getAccessibleSections(userRole: string): string[] {
    const allSections = ['dashboard', 'products', 'categories', 'orders', 'stock', 'customers', 'content', 'settings', 'admin-users'];
    return allSections.filter(section => this.canAccessSection(userRole, section));
  }

  /**
   * Check if user can access specific features within sections
   */
  canAccessFeature(userRole: string, feature: string): boolean {
    const featurePermissions: { [key: string]: string } = {
      'add_product': 'products',
      'edit_product': 'products',
      'delete_product': 'products',
      'manage_pricing': 'pricing',
      'manage_discounts': 'discounts',
      'process_orders': 'orders',
      'manage_stock': 'stock_management',
      'manage_customers': 'customers',
      'manage_blogs': 'blogs',
      'manage_recommendations': 'recommendations',
      'manage_users': 'manage_users',
      'access_settings': 'settings',
      'view_tax_info': 'tax_information'
    };

    const requiredPermission = featurePermissions[feature];
    if (!requiredPermission) {
      return false;
    }

    return this.hasPermission(userRole, requiredPermission);
  }

  /**
   * Get role display name
   */
  getRoleDisplayName(role: string): string {
    const roleInfo = this.rolePermissions[role];
    return roleInfo ? roleInfo.name : role;
  }

  /**
   * Get role description
   */
  getRoleDescription(role: string): string {
    const roleInfo = this.rolePermissions[role];
    return roleInfo ? roleInfo.description : '';
  }
}
