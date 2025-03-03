import React, { useEffect, useState } from "react";
import ContributionForm from "../components/contributions/ContributionForm";
import ContributionHistory from "../components/contributions/ContributionHistory";
import ContributionFilters from "../components/contributions/ContributionFilters";
import Card from "../components/shared/Card";
import Navbar from "../components/shared/Navbar";
import Sidebar from "../components/shared/Sidebar";
import Loading from "../components/shared/Loading";
import { ContributionType } from "../types/contribution.types";
import { useContributions } from "../components/hooks/useContributions";
import { useAuth } from "../components/hooks/useAuth";

const ContributionsPage: React.FC = () => {
  const { authState: { user } } = useAuth();
  const { contributions, fetchContributions, createContribution, isLoading } = useContributions();
  const [filteredContributions, setFilteredContributions] = useState(contributions);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    startDate: null,
    endDate: null,
    sortBy: "date",
    sortDirection: "desc",
  });

  useEffect(() => {
    if (user) {
      fetchContributions();
    }
  }, [user, fetchContributions]);

  useEffect(() => {
    // Apply filters to contributions
    let filtered = [...contributions];

    // Filter by type
    if (filters.type !== "all") {
      filtered = filtered.filter(
        (contribution) => contribution.type === filters.type
      );
    }

    // Filter by date range
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(
        (contribution) =>
          new Date(contribution.date) >= new Date(filters.startDate! as string) &&
          new Date(contribution.date) <= new Date(filters.endDate! as string)
      );
    }

    // Sort contributions
    filtered.sort((a, b) => {
      if (filters.sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return filters.sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (filters.sortBy === "amount") {
        return filters.sortDirection === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });

    setFilteredContributions(filtered);
  }, [contributions, filters]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSubmitSuccess = () => {
    setShowForm(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={true} toggleSidebar={() => { }} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={() => { }} toggleNotifications={() => { }} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Contributions</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              {showForm ? "Cancel" : "Make Contribution"}
            </button>
          </div>

          {showForm && (
            <Card className="mb-6">
              <ContributionForm onSubmitSuccess={handleSubmitSuccess} />
            </Card>
          )}

          <Card className="mb-6">
            <ContributionFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </Card>

          <Card>
            <ContributionHistory
              contributions={filteredContributions}
              isLoading={isLoading}
            />
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ContributionsPage;