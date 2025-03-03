import React, { useState, useEffect } from 'react';

interface Contribution {
  id: string;
  date: Date;
  amount: number;
  type: 'Mandatory' | 'Voluntary';
  status: 'Processed' | 'Pending' | 'Failed';
}

interface BenefitCalculatorProps {
  contributions: Contribution[];
  age: number;
  retirementAge?: number;
  expectedReturnRate?: number;
  inflationRate?: number;
  isLoading?: boolean;
}

const BenefitCalculator: React.FC<BenefitCalculatorProps> = ({
  contributions,
  age,
  retirementAge = 60,
  expectedReturnRate = 0.08,
  inflationRate = 0.03,
  isLoading = false
}) => {
  const [yearsToRetirement, setYearsToRetirement] = useState(retirementAge - age);
  const [projectedReturnRate, setProjectedReturnRate] = useState(expectedReturnRate);
  const [projectedInflationRate, setProjectedInflationRate] = useState(inflationRate);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculation states
  const [currentBalance, setCurrentBalance] = useState(0);
  const [projectedBalance, setProjectedBalance] = useState(0);
  const [monthlyPension, setMonthlyPension] = useState(0);
  const [pensionDuration, setPensionDuration] = useState(20);
  const [projectionData, setProjectionData] = useState<{ year: number; balance: number }[]>([]);

  useEffect(() => {
    if (!isLoading && contributions.length > 0) {
      // Calculate current balance
      const totalProcessed = contributions
        .filter(c => c.status === 'Processed')
        .reduce((sum, c) => sum + c.amount, 0);
        
      setCurrentBalance(totalProcessed);
    }
  }, [contributions, isLoading]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateProjection = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      try {
        // Calculate average monthly contribution
        const processedContributions = contributions.filter(c => c.status === 'Processed');
        
        if (processedContributions.length === 0) {
          setProjectedBalance(0);
          setMonthlyPension(0);
          setIsCalculating(false);
          return;
        }
        
        const dateRange = {
          earliest: new Date(Math.min(...processedContributions.map(c => new Date(c.date).getTime()))),
          latest: new Date(Math.max(...processedContributions.map(c => new Date(c.date).getTime())))
        };
        
        // Calculate months between earliest and latest contribution
        const monthsDiff = (dateRange.latest.getFullYear() - dateRange.earliest.getFullYear()) * 12 +
                          (dateRange.latest.getMonth() - dateRange.earliest.getMonth()) + 1;
        
        // Calculate average monthly contribution (or use actual if only one month of data)
        const avgMonthlyContribution = monthsDiff <= 1 
          ? currentBalance 
          : currentBalance / monthsDiff;
        
        // Project future balance
        let futureBalance = currentBalance;
        const projectionPoints: { year: number; balance: number }[] = [
          { year: 0, balance: futureBalance }
        ];
        
        // Monthly compounding over years to retirement
        const monthsToRetirement = yearsToRetirement * 12;
        const monthlyReturnRate = projectedReturnRate / 12;
        
        for (let month = 1; month <= monthsToRetirement; month++) {
          // Add monthly contribution
          futureBalance += avgMonthlyContribution;
          
          // Apply monthly return
          futureBalance *= (1 + monthlyReturnRate);
          
          // Create year data points for chart
          if (month % 12 === 0) {
            projectionPoints.push({
              year: month / 12,
              balance: futureBalance
            });
          }
        }
        
        // Adjust for inflation
        const inflationAdjusted = futureBalance / Math.pow(1 + projectedInflationRate, yearsToRetirement);
        
        // Calculate monthly pension (assuming 20 years post-retirement)
        const calculatedMonthlyPension = calculateMonthlyPension(futureBalance, pensionDuration);
        
        setProjectedBalance(futureBalance);
        setMonthlyPension(calculatedMonthlyPension);
        setMonthlyWithdrawal(calculatedMonthlyPension);
        setProjectionData(projectionPoints);
      } catch (error) {
        console.error('Error calculating projection:', error);
      } finally {
        setIsCalculating(false);
      }
    }, 800);
  };

  const calculateMonthlyPension = (balance: number, years: number): number => {
    // Simple calculation - dividing total by months
    // In a real app, would use a more sophisticated formula with life expectancy and inflation
    const months = years * 12;
    return balance / months;
  };

  const handleRecalculate = () => {
    const calculatedMonthlyPension = calculateMonthlyPension(projectedBalance, pensionDuration);
    setMonthlyPension(calculatedMonthlyPension);
    setMonthlyWithdrawal(calculatedMonthlyPension);
  };

  useEffect(() => {
    if (currentBalance > 0 && !isLoading) {
      calculateProjection();
    }
  }, [currentBalance, isLoading]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Benefit Calculator</h2>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Current Status</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Current Balance</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentBalance)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-lg font-medium text-gray-900">{age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Years to Retirement</p>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={yearsToRetirement}
                      onChange={(e) => setYearsToRetirement(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-2 text-lg font-medium text-gray-900">{yearsToRetirement}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-indigo-700 mb-4">Projected Benefits</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-indigo-600">Projected Balance at Retirement</p>
                  <p className="text-2xl font-bold text-indigo-900">
                    {isCalculating ? (
                      <span className="inline-block w-40 h-8 bg-indigo-200 rounded animate-pulse"></span>
                    ) : (
                      formatCurrency(projectedBalance)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-indigo-600">Estimated Monthly Pension</p>
                  <p className="text-xl font-bold text-indigo-900">
                    {isCalculating ? (
                      <span className="inline-block w-32 h-7 bg-indigo-200 rounded animate-pulse"></span>
                    ) : (
                      formatCurrency(monthlyPension)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-indigo-600">Retirement Age</p>
                  <p className="text-lg font-medium text-indigo-900">{retirementAge}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Projection Parameters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Annual Return Rate (%)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.1"
                    value={projectedReturnRate * 100}
                    onChange={(e) => setProjectedReturnRate(parseFloat(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 text-lg font-medium text-gray-900">{(projectedReturnRate * 100).toFixed(1)}%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Projected Annual Inflation Rate (%)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={projectedInflationRate * 100}
                    onChange={(e) => setProjectedInflationRate(parseFloat(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 text-lg font-medium text-gray-900">{(projectedInflationRate * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={calculateProjection}
                disabled={isCalculating}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isCalculating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </span>
                ) : (
                  'Recalculate Projection'
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Retirement Planning</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Withdrawal Duration (Years)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="10"
                    max="30"
                    value={pensionDuration}
                    onChange={(e) => {
                      setPensionDuration(parseInt(e.target.value));
                      // Recalculate pension based on new duration
                      const newMonthlyPension = calculateMonthlyPension(projectedBalance, parseInt(e.target.value));
                      setMonthlyPension(newMonthlyPension);
                      setMonthlyWithdrawal(newMonthlyPension);
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 text-lg font-medium text-gray-900">{pensionDuration}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Withdrawal Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₦</span>
                  </div>
                  <input
                    type="number"
                    value={Math.round(monthlyWithdrawal)}
                    onChange={(e) => setMonthlyWithdrawal(parseFloat(e.target.value) || 0)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">NGN</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {monthlyWithdrawal > monthlyPension ? (
                    <span className="text-red-500">
                      Warning: This withdrawal rate may deplete your pension sooner than expected.
                    </span>
                  ) : (
                    <span className="text-green-500">
                      This withdrawal rate is sustainable for your pension duration.
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={handleRecalculate}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Withdrawal Plan
              </button>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Benefit Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-gray-700 mb-2">At Retirement (Age {retirementAge})</h4>
                <p className="text-sm text-gray-600 mb-1">Projected Balance:</p>
                <p className="text-lg font-bold text-gray-900 mb-2">{formatCurrency(projectedBalance)}</p>
                <p className="text-sm text-gray-600 mb-1">Monthly Pension:</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(monthlyPension)}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-gray-700 mb-2">Pension Duration</h4>
                <p className="text-sm text-gray-600 mb-1">Years of Withdrawal:</p>
                <p className="text-lg font-bold text-gray-900 mb-2">{pensionDuration} years</p>
                <p className="text-sm text-gray-600 mb-1">Fund Depletion Age:</p>
                <p className="text-lg font-bold text-gray-900">
                  {retirementAge + pensionDuration} years (approx.)
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
              <p className="font-medium mb-1">Important Note:</p>
              <p>
                This projection is an estimate based on current contribution patterns and assumed investment returns.
                Actual results may vary based on market conditions, future contributions, and regulatory changes.
                We recommend reviewing your pension plan annually with a financial advisor.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BenefitCalculator;