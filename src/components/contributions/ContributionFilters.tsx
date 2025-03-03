import React, { useState } from 'react';
import Button from '../shared/Button';
// import Button from '../../shared/Button';

interface ContributionFiltersProps {
  onFilterChange: (filters: any) => void;
}

const ContributionFilters: React.FC<ContributionFiltersProps> = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      startDate,
      endDate,
      type,
      status,
      sortBy,
      sortOrder,
    });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setType('all');
    setStatus('all');
    setSortBy('date');
    setSortOrder('desc');
    
    onFilterChange({
      startDate: '',
      endDate: '',
      type: 'all',
      status: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-xs font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              className="w-full text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-xs font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              className="w-full text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-xs font-medium text-gray-700 mb-1">
              Contribution Type
            </label>
            <select
              id="type"
              className="w-full text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="mandatory">Mandatory</option>
              <option value="voluntary">Voluntary (AVC)</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className="w-full text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortBy" className="block text-xs font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              className="w-full text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="type">Type</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortOrder" className="block text-xs font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <select
              id="sortOrder"
              className="w-full text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end space-x-2 mt-2">
            <Button variant="light" type="button" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="primary" type="submit" size="sm">
              Apply Filters
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContributionFilters;