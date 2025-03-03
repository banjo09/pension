export interface User {
  id: string;
  password?: string;
  fullName: string;
  email: string;
  role: 'admin' | 'member';
  profileImage?: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  photoUrl?: string;
}

export interface NextOfKin {
  fullName: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export interface Employer {
  name: string;
  id: string;
  industry: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export interface UserProfile extends User {
  nextOfKin: NextOfKin;
  employer: Employer;
}