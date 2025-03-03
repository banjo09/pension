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

export const getContributions = async (userId: string): Promise<Contribution[]> => {
  return mockGetContributions(userId);
};

export const addContribution = async (
  userId: string, 
  contribution: Omit<Contribution, 'id' | 'userId' | 'status'>
): Promise<Contribution> => {
  return mockAddContribution(userId, contribution);
};

export const getContributionSummary = async (userId: string): Promise<ContributionSummary> => {
  return mockGetContributionSummary(userId);
};

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
  
  return { valid: true };
};