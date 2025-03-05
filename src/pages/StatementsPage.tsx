import React, { useState, useEffect } from "react";
import StatementGenerator from "../components/statements/StatementGenerator";
import DateRangeSelector from "../components/statements/DateRangeSelector";
import BenefitCalculator from "../components/statements/BenefitCalculator";
import Card from "../components/shared/Card";
import Navbar from "../components/shared/Navbar";
import Sidebar from "../components/shared/Sidebar";
import Loading from "../components/shared/Loading";
// import { useAuth } from "../context/AuthContext";
import { useContributions } from "../components/hooks/useContributions";
import { useAuth } from "../components/hooks/useAuth";
// import { useAuth } from "../hooks/useAuth";
// import { useContributions } from "../hooks/useContributions";

const StatementsPage: React.FC = () => {
  const { authState: { user } } = useAuth();
  // const { user } = useAuth();
  const { contributions, fetchContributions, isLoading } = useContributions();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    endDate: new Date(), // Today
  });
  const [showBenefitCalculator, setShowBenefitCalculator] = useState(false);
  const [filteredContributions, setFilteredContributions] = useState(contributions);

  useEffect(() => {
    if (user) {
      fetchContributions();
      // fetchContributions(user.id);
    }
  }, [user, fetchContributions]);

  useEffect(() => {
    // Filter contributions based on date range
    if (dateRange.startDate && dateRange.endDate) {
      const filtered = contributions.filter(
        (contribution) =>
          new Date(contribution.date) >= dateRange.startDate &&
          new Date(contribution.date) <= dateRange.endDate
      );
      setFilteredContributions(filtered);
    }
  }, [contributions, dateRange]);

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setDateRange({ startDate, endDate });
      // setDateRange({ startDate: startDate ?? undefined, endDate: endDate ?? undefined });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <Sidebar isOpen={true} toggleSidebar={() => { }} /> */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* <Navbar toggleSidebar={() => { }} toggleNotifications={() => { }} /> */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Statements</h1>
            <button
              onClick={() => setShowBenefitCalculator(!showBenefitCalculator)}
              className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            >
              {showBenefitCalculator
                ? "Hide Benefit Calculator"
                : "Benefit Calculator"}
            </button>
          </div>

          <Card className="mb-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Select Statement Period
            </h2>
            <DateRangeSelector
              // startDate={dateRange.startDate}
              // endDate={dateRange.endDate}
              // onChange={handleDateRangeChange}
              onDateRangeChange={handleDateRangeChange}
              initialStartDate={dateRange.startDate}
              initialEndDate={dateRange.endDate}
            />
          </Card>

          {showBenefitCalculator && (
            <Card className="mb-6">
              <BenefitCalculator
                contributions={contributions}
                age={34}
              // age={user.}
              // retirementAge={user}


              />
            </Card>
          )}

          <Card>
            <StatementGenerator
              contributions={filteredContributions}
              // dateRange={dateRange}
              userData={user!}
              isLoading={isLoading}
            />
          </Card>
        </main>
      </div>
    </div>
  );
};

export default StatementsPage;