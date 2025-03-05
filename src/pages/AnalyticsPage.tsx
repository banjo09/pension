import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';

// Mock data - replace with actual data fetching
const contributionData = [
  { month: 'Jan', contributions: 4000 },
  { month: 'Feb', contributions: 3000 },
  { month: 'Mar', contributions: 5000 },
  { month: 'Apr', contributions: 4500 },
  { month: 'May', contributions: 6000 },
  { month: 'Jun', contributions: 5500 }
];

const memberRoleData = [
  { name: 'Members', value: 400 },
  { name: 'Admins', value: 30 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsPage: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState('6months');

  const analyticsCards = [
    {
      title: 'Total Members',
      value: '430',
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total Contributions',
      value: '$2,450,000',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Growth Rate',
      value: '15.3%',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Average Contribution',
      value: '$5,697',
      icon: Calendar,
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Analytics Dashboard
      </h1>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {analyticsCards.map((card, index) => (
          <div 
            key={index} 
            className={`${card.color} p-6 rounded-lg shadow-md flex items-center`}
          >
            <div className="mr-4">
              <card.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contributions Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Contribution Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="contributions" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Member Roles Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={memberRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {memberRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;