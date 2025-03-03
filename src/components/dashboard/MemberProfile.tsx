import React from 'react';
import { UserProfile } from '../../types/user.types';

interface MemberProfileProps {
  profile: UserProfile;
  isLoading: boolean;
}

const MemberProfile: React.FC<MemberProfileProps> = ({ profile, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-300 h-16 w-16"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-shrink-0">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.fullName}
                className="h-24 w-24 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
                {profile.fullName.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{profile.fullName}</h2>
            <p className="text-gray-500">{profile.email}</p>
            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Member
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-medium">{profile.phoneNumber}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{profile.address}</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Next of Kin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{profile.nextOfKin.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Relationship</p>
            <p className="font-medium">{profile.nextOfKin.relationship}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-medium">{profile.nextOfKin.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{profile.nextOfKin.email}</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Employer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Company Name</p>
            <p className="font-medium">{profile.employer.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-medium">{profile.employer.industry}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{profile.employer.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact Person</p>
            <p className="font-medium">{profile.employer.contactPerson}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact Email</p>
            <p className="font-medium">{profile.employer.contactEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
