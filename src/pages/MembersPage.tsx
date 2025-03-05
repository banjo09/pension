import React, { useState, useMemo } from 'react';
import { Search, UserPlus, Filter } from 'lucide-react';

// Mock data - replace with actual data fetching
const mockMembers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Member',
    contributions: 24500,
    joinDate: '2022-03-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Admin',
    contributions: 35000,
    joinDate: '2021-11-20'
  }
];

const MembersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Memoized filtered members
  const filteredMembers = useMemo(() => {
    return mockMembers.filter(member => 
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === '' || member.role === filterRole)
    );
  }, [searchTerm, filterRole]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Members Management
        </h1>
        <button 
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <UserPlus className="mr-2 w-5 h-5" />
          Add Member
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {/* Search and Filter Section */}
        <div className="flex space-x-4 mb-6">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-right">Total Contributions</th>
                <th className="p-3 text-left">Join Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{member.name}</td>
                  <td className="p-3">{member.email}</td>
                  <td className="p-3">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${member.role === 'Admin' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                      }
                    `}>
                      {member.role}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    ${member.contributions.toLocaleString()}
                  </td>
                  <td className="p-3">{member.joinDate}</td>
                  <td className="p-3 text-center">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No Results State */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No members found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembersPage;