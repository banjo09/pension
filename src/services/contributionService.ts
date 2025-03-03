import api from './api';
import { 
  Contribution, 
  ContributionSummary,
  ContributionType 
} from '../types/contribution.types';
import { 
  mockGetContributions, 
  mockAddContribution,
  mockGetContributionSummary 
} from '../mock/mockData';

/**
 * Get all contributions for a user
 */
export const getContributions = async (userId: string): Promise<Contribution[]> => {
  // In production, you would use:
  // return api.get(`/users/${userId}/contributions`).then(res => res.data);
  return mockGetContributions(userId);
};

/**
 * Add a new contribution for a user
 */
export const addContribution = async (
  userId: string, 
  contribution: Omit<Contribution, 'id' | 'userId' | 'status'>
): Promise<Contribution> => {
  // In production, you would use:
  // return api.post(`/users/${userId}/contributions`, contribution).then(res => res.data);
  return mockAddContribution(userId, contribution);
};

/**
 * Get contribution summary statistics for a user
 */
export const getContributionSummary = async (userId: string): Promise<ContributionSummary> => {
  // In production, you would use:
  // return api.get(`/users/${userId}/contributions/summary`).then(res => res.data);
  return mockGetContributionSummary(userId);
};

/**
 * Validate a contribution based on business rules
 */
export const validateContribution = (
  date: string, 
  type: ContributionType, 
  existingContributions: Contribution[]
): { valid: boolean; message?: string } => {
  // Check if date is in the future
  const contributionDate = new Date(date);
  const currentDate = new Date();
  if (contributionDate > currentDate) {
    return { valid: false, message: 'Future dates are not allowed' };
  }
  
  // For mandatory contributions, check if one already exists for the month
  if (type === 'mandatory') {
    const month = contributionDate.getMonth();
    const year = contributionDate.getFullYear();
    
    const existingMandatory = existingContributions.find(c => {
      const cDate = new Date(c.date);
      return c.type === 'mandatory' && 
             cDate.getMonth() === month && 
             cDate.getFullYear() === year;
    });
    
    if (existingMandatory) {
      return { 
        valid: false, 
        message: 'Only one mandatory contribution is allowed per month' 
      };
    }
  }
  
  // Check for duplicate reference numbers
  // Would normally be implemented here, but would need the reference to check
  
  return { valid: true };
};