import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { AlertCircle } from 'lucide-react';

// Types
interface Contribution {
  id: string;
  date: string;
  amount: number;
  type: 'mandatory' | 'voluntary';
  status: 'processed' | 'pending' | 'failed';
}

interface ContributionsByMonth {
  month: string;
  mandatory: number;
  voluntary: number;
  total: number;
}

interface ContributionsByType {
  name: string;
  value: number;
}

interface DataVisualizationsProps {
  userId?: string;
  isLoading?: boolean;
  error?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DataVisualizations: React.FC<DataVisualizationsProps> = ({ 
  userId, 
  isLoading = false,
  error = ''
}) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [contributionsByMonth, setContributionsByMonth] = useState<ContributionsByMonth[]>([]);
  const [contributionsByType, setContributionsByType] = useState<ContributionsByType[]>([]);
  const [timeRange, setTimeRange] = useState<string>('6months');
  const [chartType, setChartType] = useState<string>('line');
  const [localLoading, setLocalLoading] = useState<boolean>(true);
  const [localError, setLocalError] = useState<string>('');

  useEffect(() => {
    // Set loading and error states based on props
    setLocalLoading(isLoading);
    setLocalError(error);

    // In a real app, you would fetch data from an API
    // For this assessment, we'll use mock data
    const fetchContributions = async () => {
      try {
        setLocalLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockContributions: Contribution[] = [
          { id: '1', date: '2025-01-15', amount: 5000, type: 'mandatory', status: 'processed' },
          { id: '2', date: '2025-01-20', amount: 2000, type: 'voluntary', status: 'processed' },
          { id: '3', date: '2024-12-15', amount: 5000, type: 'mandatory', status: 'processed' },
          { id: '4', date: '2024-12-05', amount: 3000, type: 'voluntary', status: 'processed' },
          { id: '5', date: '2024-11-15', amount: 5000, type: 'mandatory', status: 'processed' },
          { id: '6', date: '2024-11-22', amount: 1500, type: 'voluntary', status: 'processed' },
          { id: '7', date: '2024-10-15', amount: 5000, type: 'mandatory', status: 'processed' },
          { id: '8', date: '2024-10-30', amount: 2500, type: 'voluntary', status: 'processed' },
          { id: '9', date: '2024-09-15', amount: 5000, type: 'mandatory', status: 'processed' },
          { id: '10', date: '2024-09-10', amount: 1000, type: 'voluntary', status: 'processed' },
          { id: '11', date: '2024-08-15', amount: 5000, type: 'mandatory', status: 'processed' },
          { id: '12', date: '2024-08-05', amount: 4000, type: 'voluntary', status: 'processed' },
        ];
        
        setContributions(mockContributions);
        processContributionData(mockContributions, timeRange);
        setLocalLoading(false);
      } catch (err) {
        setLocalError('Failed to load contribution data');
        setLocalLoading(false);
      }
    };

    fetchContributions();
  }, [userId, isLoading, error]);

  // Process contribution data whenever time range changes
  useEffect(() => {
    processContributionData(contributions, timeRange);
  }, [timeRange, contributions]);

  // Function to process contribution data based on selected time range
  const processContributionData = (data: Contribution[], range: string) => {
    if (!data.length) return;

    // Filter data based on time range
    const currentDate = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '3months':
        startDate.setMonth(currentDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(currentDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setMonth(currentDate.getMonth() - 6);
    }

    const filteredData = data.filter(item => new Date(item.date) >= startDate);

    // Process data for monthly chart
    const monthlyData: Record<string, ContributionsByMonth> = {};
    
    filteredData.forEach(item => {
      const date = new Date(item.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          month: monthYear,
          mandatory: 0,
          voluntary: 0,
          total: 0
        };
      }
      
      if (item.type === 'mandatory') {
        monthlyData[monthYear].mandatory += item.amount;
      } else {
        monthlyData[monthYear].voluntary += item.amount;
      }
      
      monthlyData[monthYear].total += item.amount;
    });
    
    // Convert to array and sort by date
    const monthlyDataArray = Object.values(monthlyData).sort((a, b) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      
      if (aYear !== bYear) {
        return parseInt(aYear) - parseInt(bYear);
      }
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(aMonth) - months.indexOf(bMonth);
    });
    
    setContributionsByMonth(monthlyDataArray);
    
    // Process data for pie chart
    let mandatoryTotal = 0;
    let voluntaryTotal = 0;
    
    filteredData.forEach(item => {
      if (item.type === 'mandatory') {
        mandatoryTotal += item.amount;
      } else {
        voluntaryTotal += item.amount;
      }
    });
    
    setContributionsByType([
      { name: 'Mandatory', value: mandatoryTotal },
      { name: 'Voluntary', value: voluntaryTotal }
    ]);
  };

  // Render loading skeleton
  if (localLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
        <div className="h-64 bg-gray-300 rounded w-full mb-4"></div>
        <div className="flex justify-between">
          <div className="h-10 bg-gray-300 rounded w-32"></div>
          <div className="h-10 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (localError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-red-800 font-medium">Error</h3>
            <div className="mt-2 text-red-700">
              <p>{localError}</p>
              <button 
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-red-500 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!contributions.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800">Contribution Visualization</h2>
        <p className="text-gray-500 mb-6">No contribution data available</p>
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-center">
            You don't have any contributions recorded yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">Contribution Visualization</h2>
        <p className="text-gray-500 mb-4">
          View your pension contribution trends over time
        </p>
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            {/* Time Range Selector */}
            <div className="relative">
              <select 
                className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="1year">1 Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            
            {/* Chart Type Selector */}
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  chartType === 'line' 
                    ? 'bg-blue-50 text-blue-700 border-blue-500 z-10' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setChartType('line')}
              >
                Line
              </button>
              <button
                type="button"
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                  chartType === 'bar' 
                    ? 'bg-blue-50 text-blue-700 border-blue-500 z-10' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setChartType('bar')}
              >
                Bar
              </button>
              <button
                type="button"
                className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  chartType === 'pie' 
                    ? 'bg-blue-50 text-blue-700 border-blue-500 z-10' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setChartType('pie')}
              >
                Distribution
              </button>
            </div>
          </div>
          
          <div>
            <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Download Data
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart
                data={contributionsByMonth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="mandatory" 
                  stroke="#0088FE" 
                  activeDot={{ r: 8 }} 
                  name="Mandatory"
                />
                <Line 
                  type="monotone" 
                  dataKey="voluntary" 
                  stroke="#00C49F" 
                  activeDot={{ r: 8 }} 
                  name="Voluntary"
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#8884d8" 
                  strokeDasharray="5 5" 
                  name="Total"
                />
              </LineChart>
            ) : chartType === 'bar' ? (
              <BarChart
                data={contributionsByMonth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="mandatory" fill="#0088FE" name="Mandatory" />
                <Bar dataKey="voluntary" fill="#00C49F" name="Voluntary" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={contributionsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {contributionsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              ₦{contributions
                .reduce((sum, item) => sum + item.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">Total Contributions</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              ₦{contributions
                .filter(item => item.type === 'mandatory')
                .reduce((sum, item) => sum + item.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">Mandatory Contributions</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-2xl font-bold text-amber-600">
              ₦{contributions
                .filter(item => item.type === 'voluntary')
                .reduce((sum, item) => sum + item.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">Voluntary Contributions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizations;