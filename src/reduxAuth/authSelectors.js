// src/store/authSelectors.js
import { ROLE_PERMISSIONS } from '../constants/permissions';

// Points to your actual state key "user"
export const selectCurrentUser = (state) => state.auth.user;

// Checks if the logged-in user has a specific permission
export const selectHasPermission = (state, permission) => {
  const user = state.auth.user;
  if (!user || !user.role) return false;

  // Developer wildcard bypasses all granular permission checks
  if (user.role === 'Developer') return true;

  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
};

// Batch check helper (great for rendering sidebars or tabs with multiple options)
export const selectHasAnyPermission = (state, permissions = []) => {
  const user = state.auth.user;
  if (!user || !user.role) return false;
  if (user.role === 'Developer') return true;

  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.some((perm) => userPermissions.includes(perm));
};