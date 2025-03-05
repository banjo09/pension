import React, { useEffect } from "react";
import { useAuth } from "../components/hooks/useAuth";
import { useContributions } from "../components/hooks/useContributions";
import MemberProfile from "../components/dashboard/MemberProfile";
import ContributionStats from "../components/dashboard/ContributionStats";
import DataVisualizations from "../components/dashboard/DataVisualizations";
import Loading from "../components/shared/Loading";

const DashboardPage: React.FC = () => {
  const { authState, logout } = useAuth();
  console.log('authState', authState)
  const {
    fetchContributions,
    isLoading,
    error,
    // contributions,
    getContributionStats
  } = useContributions();

  useEffect(() => {
    if (authState.user?.id) {
      fetchContributions();
    }
  }, [authState.user?.id, fetchContributions]);

  if (isLoading) {
    return <Loading />;
    // return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
        Error loading dashboard: {error}
      </div>
    );
  }

  const stats = getContributionStats();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Member Dashboard</h1>
        <h1 className="text-2xl font-bold mb-6" onClick={logout}>Log out</h1>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-1">
          <MemberProfile user={authState.user} />
        </div>

        {/* Right column (2/3 width on large screens) */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <ContributionStats stats={stats} />
          </div>

          <div>
            <DataVisualizations
              // contributions={contributions} 
              // monthlyData={stats.monthlyData} 
              userId={authState.user?.id}
              isLoading={isLoading}
              error={error ?? undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
