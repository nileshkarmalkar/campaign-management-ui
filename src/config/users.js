export const users = {
  "admin@telus.com": {
    role: "admin",
    name: "Admin User",
    permissions: {
      read: true,
      write: true,
      modify: true
    }
  },
  "user@telus.com": {
    role: "user",
    name: "Regular User",
    permissions: {
      read: true,
      write: true,
      modify: false
    }
  },
  "viewer@telus.com": {
    role: "viewer",
    name: "View Only User",
    permissions: {
      read: true,
      write: false,
      modify: false
    }
  }
};

export const roles = {
  admin: {
    name: "Administrator",
    level: 3,
    description: "Full access to all features including user management"
  },
  user: {
    name: "Regular User",
    level: 2,
    description: "Can create and edit content but cannot modify system settings"
  },
  viewer: {
    name: "Viewer",
    level: 1,
    description: "Read-only access to all content"
  }
};

export const hasPermission = (userRole, requiredPermission) => {
  const roleLevel = roles[userRole]?.level || 0;
  switch (requiredPermission) {
    case 'read':
      return roleLevel >= 1;
    case 'write':
      return roleLevel >= 2;
    case 'modify':
      return roleLevel >= 3;
    default:
      return false;
  }
};
