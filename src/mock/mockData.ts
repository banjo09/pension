// import { 
//   User, 
//   LoginCredentials, 
//   UserProfile, 
//   Contribution,
//   ContributionSummary,
//   ContributionType,
//   Statement,
//   StatementFilter,
//   Notification
// } from '../types';

import { LoginCredentials } from "../types/auth.types";
import { Contribution, ContributionSummary } from "../types/contribution.types";
import { Notification } from "../types/notifications.types";
import { Statement, StatementFilter } from "../types/statement.types";
import { User, UserProfile } from "../types/user.types";

// Mock Users
const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'member',
    profileImage: '/api/placeholder/150/150',
    dateOfBirth: '1985-05-15',
    phoneNumber: '+2348012345678',
    address: '123 Main St, Lagos, Nigeria'
  },
  {
    id: '2',
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    profileImage: '/api/placeholder/150/150',
    dateOfBirth: '1980-01-01',
    phoneNumber: '+2348098765432',
    address: '456 Admin Ave, Abuja, Nigeria'
  }
];

// Mock User Profiles
const mockUserProfiles: Record<string, UserProfile> = {
  '1': {
    ...mockUsers[0],
    nextOfKin: {
      fullName: 'Jane Doe',
      relationship: 'Spouse',
      phoneNumber: '+2348087654321',
      email: 'jane@example.com',
      address: '123 Main St, Lagos, Nigeria'
    },
    employer: {
      name: 'ABC Corporation',
      id: 'EMP001',
      industry: 'Technology',
      address: '789 Tech Park, Lagos, Nigeria',
      contactPerson: 'HR Manager',
      contactEmail: 'hr@abccorp.com',
      contactPhone: '+2348011223344'
    }
  }
};

// Mock Contributions
const mockContributions: Record<string, Contribution[]> = {
  '1': [
    {
      id: 'c1',
      userId: '1',
      amount: 25000,
      date: '2025-01-15',
      type: 'mandatory',
      status: 'approved',
      employerPortion: 12500,
      employeePortion: 12500
    },
    {
      id: 'c2',
      userId: '1',
      amount: 10000,
      date: '2025-01-20',
      type: 'voluntary',
      status: 'approved',
      description: 'Additional contribution'
    },
    {
      id: 'c3',
      userId: '1',
      amount: 25000,
      date: '2024-12-15',
      type: 'mandatory',
      status: 'approved',
      employerPortion: 12500,
      employeePortion: 12500
    },
    {
      id: 'c4',
      userId: '1',
      amount: 25000,
      date: '2024-11-15',
      type: 'mandatory',
      status: 'approved',
      employerPortion: 12500,
      employeePortion: 12500
    },
    {
      id: 'c5',
      userId: '1',
      amount: 15000,
      date: '2024-11-25',
      type: 'voluntary',
      status: 'approved',
      description: 'End of year contribution'
    }
  ]
};

// Mock Notifications
const mockNotifications: Record<string, Notification[]> = {
  '1': [
    {
      id: 'n1',
      title: 'Contribution Approved',
      message: 'Your mandatory contribution for January has been approved.',
      type: 'success',
      isRead: false,
      createdAt: '2025-01-16T10:30:00Z',
      link: '/contributions'
    },
    {
      id: 'n2',
      title: 'Statement Generated',
      message: 'Your annual statement for 2024 is now available.',
      type: 'info',
      isRead: true,
      createdAt: '2025-01-05T08:15:00Z',
      link: '/statements'
    }
  ]
};

// Mock Authentication
export const mockLogin = (credentials: LoginCredentials): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('userId', user.id);
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

export const mockGetCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (token && userId) {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          resolve(userWithoutPassword);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, 300);
  });
};

// Mock User Profile
export const mockGetUserProfile = (userId: string): Promise<UserProfile> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const profile = mockUserProfiles[userId];
      if (profile) {
        resolve(profile);
      } else {
        reject(new Error('User profile not found'));
      }
    }, 300);
  });
};

// Mock Contributions
export const mockGetContributions = (userId: string): Promise<Contribution[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const contributions = mockContributions[userId] || [];
      resolve([...contributions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, 300);
  });
};

export const mockAddContribution = (
  userId: string,
  contribution: Omit<Contribution, 'id' | 'userId' | 'status'>
): Promise<Contribution> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newContribution: Contribution = {
        id: `c${Date.now()}`,
        userId,
        status: 'pending',
        ...contribution
      };
      
      if (!mockContributions[userId]) {
        mockContributions[userId] = [];
      }
      
      mockContributions[userId].push(newContribution);
      resolve(newContribution);
    }, 500);
  });
};

export const mockGetContributionSummary = (userId: string): Promise<ContributionSummary> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const contributions = mockContributions[userId] || [];
      
      const total = contributions.reduce((sum, c) => sum + c.amount, 0);
      const mandatory = contributions
        .filter(c => c.type === 'mandatory')
        .reduce((sum, c) => sum + c.amount, 0);
      const voluntary = contributions
        .filter(c => c.type === 'voluntary')
        .reduce((sum, c) => sum + c.amount, 0);
      
      // Calculate current month contribution
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      const currentMonthContributions = contributions.filter(c => {
        const date = new Date(c.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
      
      const currentMonthTotal = currentMonthContributions.reduce((sum, c) => sum + c.amount, 0);
      
      // Get last contribution date
      const sortedContributions = [...contributions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const lastContributionDate = sortedContributions.length > 0 
        ? sortedContributions[0].date 
        : '';
      
      // Calculate growth (simplified)
      const growth = 8.5; // Mock 8.5% growth
      
      resolve({
        totalContributions: total,
        mandatoryContributions: mandatory,
        voluntaryContributions: voluntary,
        currentMonthContribution: currentMonthTotal,
        lastContributionDate,
        contributionGrowth: growth
      });
    }, 300);
  });
};

// Mock Statements
export const mockGenerateStatement = (
  userId: string,
  filter: StatementFilter
): Promise<Statement> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allContributions = mockContributions[userId] || [];
      
      // Filter contributions by date range
      const filteredContributions = allContributions.filter(c => {
        const date = new Date(c.date);
        const start = new Date(filter.startDate);
        const end = new Date(filter.endDate);
        
        return date >= start && date <= end;
      });
      
      // Further filter by contribution type if specified
      const typeFilteredContributions = filter.contributionTypes 
        ? filteredContributions.filter(c => filter.contributionTypes?.includes(c.type))
        : filteredContributions;
      
      const totalAmount = typeFilteredContributions.reduce((sum, c) => sum + c.amount, 0);
      
      // Simple projection calculation
      const projectedLumpSum = totalAmount * 1.4; // Simple 40% growth
      const projectedMonthlyPension = (totalAmount * 0.004); // 0.4% monthly
      
      const statement: Statement = {
        id: `s${Date.now()}`,
        userId,
        generatedDate: new Date().toISOString(),
        startDate: filter.startDate,
        endDate: filter.endDate,
        contributions: typeFilteredContributions,
        totalAmount,
        projectedBenefits: {
          lumpSum: projectedLumpSum,
          monthlyPension: projectedMonthlyPension
        }
      };
      
      resolve(statement);
    }, 700);
  });
};

// Mock Notifications
export const mockGetNotifications = (userId: string): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notifications = mockNotifications[userId] || [];
      resolve([...notifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    }, 300);
  });
};

export const mockMarkNotificationAsRead = (
  userId: string,
  notificationId: string
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mockNotifications[userId]) {
        const notification = mockNotifications[userId].find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
        }
      }
      resolve();
    }, 200);
  });
};
