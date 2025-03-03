import React from "react";
import { User } from "../../types/user.types";

interface MemberProfileProps {
  user: User | null;
}

const MemberProfile: React.FC<MemberProfileProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <p>User profile not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-center mb-6">
        <div className="relative inline-block">
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.fullName}
              className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold">
              {user.fullName.split(" ").map(name => name[0]).join("").toUpperCase()}
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold mt-4">{user.fullName}</h2>
        <p className="text-gray-500 capitalize">{user.role}</p>
      </div>

      <div className="border-t pt-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1">{user.email}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
            <p className="mt-1">{user.phoneNumber}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
            <p className="mt-1">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="mt-1">{user.address}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default MemberProfile;