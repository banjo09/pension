import { useState, useEffect, useCallback } from 'react';
// import { Contribution, ContributionType } from '../types/contribution.types';
// import { contributionService } from '../services/contributionService';
import { useNotifications } from './useNotifications';
import { Contribution, } from '../../types/contribution.types';
import { addContribution, getContributions } from '../../services/contributionService';
import { useAuth } from './useAuth';
// import { formatContributionType } from '../../utils/formatters';


export const useContributions = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast, addNotification } = useNotifications();
    const { authState: { user } } = useAuth();
  

  // Fetch contributions
  const fetchContributions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const data = await contributionService.getContributions();
      const data = await getContributions(user!.id);
      setContributions(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validate contribution based on business rules
  const validateContribution = useCallback((contribution: Partial<Contribution>): { isValid: boolean; message?: string } => {
    // Check if contribution has a future date
    if (contribution.date && new Date(contribution.date) > new Date()) {
      return { isValid: false, message: 'Contribution date cannot be in the future' };
    }

    // For mandatory contributions, check if there's already one in the current month
    if (contribution.type === formatContributionType.MANDATORY) {
      // Get the year and month of the contribution
      const contributionDate = new Date(contribution.date as string);
      const contributionMonth = contributionDate.getMonth();
      const contributionYear = contributionDate.getFullYear();

      // Check if there's already a mandatory contribution in this month
      const existingContribution = contributions.find(c => {
        if (c.type !== ContributionType.MANDATORY) return false;
        
        const existingDate = new Date(c.date);
        return (
          existingDate.getMonth() === contributionMonth &&
          existingDate.getFullYear() === contributionYear &&
          c.id !== contribution.id // Exclude current contribution when editing
        );
      });

      if (existingContribution) {
        return { 
          isValid: false, 
          message: 'Only one mandatory contribution is allowed per calendar month' 
        };
      }
    }

    // Check for duplicate transaction reference
    if (contribution.reference) {
      const duplicateReference = contributions.find(c => 
        c.reference === contribution.reference && c.id !== contribution.id
      );
      
      if (duplicateReference) {
        return { isValid: false, message: 'Duplicate transaction reference detected' };
      }
    }

    return { isValid: true };
  }, [contributions]);

  // Create new contribution
  const createContribution = useCallback(async (contribution: Omit<Contribution, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    const validation = validateContribution(contribution);
    if (!validation.isValid) {
      setError(validation.message || 'Invalid contribution');
      setIsLoading(false);
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: validation.message || 'Invalid contribution',
      });
      return false;
    }
    
    try {
      const newContribution = await addContribution(user!.id, contribution);
      // const newContribution = await contributionService.createContribution(contribution);
      setContributions(prev => [...prev, newContribution]);
      
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Contribution submitted successfully',
      });
      
      addNotification({
        title: 'New Contribution',
        message: `${contribution.type} contribution of ${contribution.amount} was successfully processed.`,
        type: 'contribution',
      });
      
      return true;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      
      showToast({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to submit contribution',
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [contributions, validateContribution, showToast, addNotification]);

  // Get contribution statistics
  const getContributionStats = useCallback(() => {
    const totalContributions = contributions.reduce((total, c) => total + c.amount, 0);
    
    const mandatoryTotal = contributions
      .filter(c => c.type === ContributionType.MANDATORY)
      .reduce((total, c) => total + c.amount, 0);
    
    const voluntaryTotal = contributions
      .filter(c => c.type === ContributionType.VOLUNTARY)
      .reduce((total, c) => total + c.amount, 0);
    
    const monthlyData = contributions.reduce((acc: Record<string, number>, c) => {
      const date = new Date(c.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!acc[monthYear]) acc[monthYear] = 0;
      acc[monthYear] += c.amount;
      
      return acc;
    }, {});
    
    return {
      totalContributions,
      mandatoryTotal,
      voluntaryTotal,
      contributionCount: contributions.length,
      mandatoryCount: contributions.filter(c => c.type === ContributionType.MANDATORY).length,
      voluntaryCount: contributions.filter(c => c.type === ContributionType.VOLUNTARY).length,
      monthlyData,
    };
  }, [contributions]);

  // Load contributions on component mount
  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  return {
    contributions,
    isLoading,
    error,
    fetchContributions,
    createContribution,
    validateContribution,
    getContributionStats,
  };
};