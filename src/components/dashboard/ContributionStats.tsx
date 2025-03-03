import React from 'react';
import { ContributionSummary } from '../../types/contribution.types';

interface ContributionStatsProps {
  summary: ContributionSummary | null;
  isLoading: boolean;
}

const ContributionStats: React.FC<ContributionStatsProps> = ({ summary, isLoading }) => {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-6">
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const stats = [
    {
      name: 'Total Contributions',
      value: formatCurrency(summary.totalContributions),
      change: `${summary.contributionGrowth >= 0 ? '+' : ''}${summary.contributionGrowth}%`,
      changeType: summary.contributionGrowth >= 0 ? 'positive' : 'negative'
    },
    {
      name: 'Mandatory Contributions',
      value: formatCurrency(summary.mandatoryContributions),
      subtext: `${((summary.mandatoryContributions / summary.totalContributions) * 100).toFixed(1)}% of total`
    },
    {
      name: 'Voluntary Contributions',
      value: formatCurrency(summary.voluntaryContributions),
      subtext: `${((summary.voluntaryContributions / summary.totalContributions) * 100).toFixed(1)}% of total`
    },
    {
      name: 'Current Month',
      value: formatCurrency(summary.currentMonthContribution),
      subtext: `Last contribution: ${new Date(summary.lastContributionDate).toLocaleDateString()}`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white shadow rounded-lg p-6">
          <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
          {stat.change && (
            <p className={`mt-2 flex items-center text-sm ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.changeType === 'positive' ? (
                <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="self-center flex-shrink-0 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span className="ml-1">{stat.change} from previous year</span>
            </p>
          )}
          {stat.subtext && (
            <p className="mt-1 text-sm text-gray-500">{stat.subtext}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContributionStats;
