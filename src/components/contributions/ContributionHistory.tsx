import React, { useState, useEffect } from 'react';
import { useContributions } from '../../../hooks/useContributions';
// import Card from '../../shared/Card';
// import Loading from '../../shared/Loading';
// import ContributionFilters from './ContributionFilters';
import Loading from '../shared/Loading';
import Card from '../shared/Card';
import ContributionFilters from './ContributionFilters';

interface Contribution {
  id: string;
  type: 'mandatory' | 'voluntary';
  amount: number;
  date: string;
  description?: string;
  status: 'pending' | 'processed' | 'rejected';
}

interface ContributionHistoryProps {
  limit?: number;
  showFilters?: boolean;
  title?: string;
}

const ContributionHistory: React.FC<ContributionHistoryProps> = ({
  limit,
  showFilters = true,
  title = 'Contribution History',
}) => {
  const { getContributions, isLoading } = useContributions();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
    status: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const fetchContributions = async () => {
    try {
      const result = await getContributions(filters);
      // If limit is provided, only show that many contributions
      setContributions(limit ? result.slice(0, limit) : result);
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
    }
  };

  useEffect(() => {
    fetchContributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'mandatory'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-purple-100 text-purple-800';
  };

  return (
    <Card title={title}>
      {showFilters && (
        <div className="mb-6">
          <ContributionFilters onFilterChange={handleFilterChange} />
        </div>
      )}

      {isLoading ? (
        <Loading text="Loading contributions..." />
      ) : contributions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No contributions found matching your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contributions.map((contribution) => (
                <tr key={contribution.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(contribution.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                        contribution.type
                      )}`}
                    >
                      {contribution.type === 'mandatory' ? 'Mandatory' : 'Voluntary'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(contribution.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        contribution.status
                      )}`}
                    >
                      {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {contribution.description || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default ContributionHistory;