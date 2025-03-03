import React from "react";
// import { formatContributionType } from "../../hooks/useContributions";

interface ContributionStatsProps {
  stats: {
    totalContributions: number;
    mandatoryTotal: number;
    voluntaryTotal: number;
    contributionCount: number;
    mandatoryCount: number;
    voluntaryCount: number;
    monthlyData: Record<string, number>;
  };
}

const ContributionStats: React.FC<ContributionStatsProps> = ({ stats }) => {
  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get current month's contribution from monthly data
  const getCurrentMonthContribution = () => {
    const now = new Date();
    const currentMonthKey = `${now.getMonth() + 1}/${now.getFullYear()}`;
    return stats.monthlyData[currentMonthKey] || 0;
  };

  const currentMonthContribution = getCurrentMonthContribution();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Contribution Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Total Contributions</h3>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalContributions)}</p>
          <p className="text-sm text-gray-500 mt-1">{stats.contributionCount} contributions</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Current Month</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(currentMonthContribution)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Mandatory</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {stats.mandatoryCount} contributions
            </span>
          </div>
          <p className="text-xl font-bold">{formatCurrency(stats.mandatoryTotal)}</p>
        </div>
        
        <div className="border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Voluntary</h3>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {stats.voluntaryCount} contributions
            </span>
          </div>
          <p className="text-xl font-bold">{formatCurrency(stats.voluntaryTotal)}</p>
        </div>
      </div>
    </div>
  );
};

export default ContributionStats;