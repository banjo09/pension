import React, { useEffect, useState } from "react";
import MemberProfile from "../components/dashboard/MemberProfile";
import ContributionStats from "../components/dashboard/ContributionStats";
import DataVisualizations from "../components/dashboard/DataVisualizations";
import Navbar from "../components/shared/Navbar";
import Sidebar from "../components/shared/Sidebar";
import Loading from "../components/shared/Loading";
import { useAuth } from "../hooks/useAuth";
import { useContributions } from "../hooks/useContributions";

const DashboardPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { contributions, fetchContributions, isLoading: contributionsLoading } = useContributions();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      fetchContributions(user.id);
    }
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user, fetchContributions]);

  if (authLoading || isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Member Profile Section */}
            <div className="lg:col-span-1">
              <MemberProfile user={user} />
            </div>
            
            {/* Contribution Statistics */}
            <div className="lg:col-span-2">
              <ContributionStats contributions={contributions} />
            </div>
          </div>
          
          {/* Data Visualizations */}
          <div className="mt-6">
            <DataVisualizations contributions={contributions} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;