import React, { useState, useEffect } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { useContributions } from '../hooks/useContributions';
import { ContributionType } from '../../types/contribution.types';

interface ContributionFormProps {
  onSubmitSuccess: () => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({ onSubmitSuccess }) => {
  const [contributionType, setContributionType] = useState<ContributionType>('mandatory');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { createContribution, validateContribution, isLoading } = useContributions();

  // Set default date to today
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};
    
    // Check if amount is valid
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
      newErrors.amount = 'Amount must be a valid decimal number';
    }

    // Check if date is valid
    if (!date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        newErrors.date = 'Future dates are not allowed';
      }
    }
    
    // Validate contribution using the hook's validateContribution method
    const contributionData = {
      type: contributionType,
      amount: parseFloat(amount),
      date: (date as unknown as Date),
      description: description.trim() || undefined,
    };
    
    const validation = validateContribution(contributionData);
    if (!validation.isValid && validation.message) {
      newErrors.form = validation.message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;
    
    try {
      const success = await createContribution({
        type: contributionType,
        amount: parseFloat(amount),
        date: (date as unknown as Date),
        description: description.trim() || undefined,
      });
      
      if (success) {
        // Reset form
        setAmount('');
        setDescription('');
        const today = new Date();
        setDate(today.toISOString().split('T')[0]);
        
        onSubmitSuccess();
      }
    } catch (error) {
      setErrors({ form: 'Failed to submit contribution. Please try again.' });
    }
  };

  return (
    <Card title="New Contribution">
      {errors.form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Contribution Type
          </label>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                id="mandatory"
                type="radio"
                name="contributionType"
                checked={contributionType === 'mandatory'}
                onChange={() => setContributionType('mandatory')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="mandatory" className="ml-2 text-sm text-gray-700">
                Mandatory
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="voluntary"
                type="radio"
                name="contributionType"
                checked={contributionType === 'voluntary'}
                onChange={() => setContributionType('voluntary')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="voluntary" className="ml-2 text-sm text-gray-700">
                Voluntary (AVC)
              </label>
            </div>
          </div>
          {contributionType === 'mandatory' && (
            <p className="mt-1 text-xs text-gray-500">
              Only one mandatory contribution is allowed per calendar month.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700 text-sm font-medium mb-2">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`pl-7 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.amount ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 text-sm font-medium mb-2">
            Contribution Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.date ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Add any additional notes about this contribution"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="light"
            onClick={() => {
              setAmount('');
              setDescription('');
              const today = new Date();
              setDate(today.toISOString().split('T')[0]);
              setErrors({});
            }}
          >
            Clear
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Submit Contribution
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ContributionForm;