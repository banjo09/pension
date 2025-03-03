import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
import DateRangeSelector from './DateRangeSelector';
import { User } from '../../types/user.types';
import { Contribution } from '../../types/contribution.types';

// interface Contribution {
//   id: string;
//   date: Date;
//   amount: number;
//   type: 'Mandatory' | 'Voluntary';
//   status: 'Processed' | 'Pending' | 'Failed';
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   membershipId: string;
// }

interface StatementGeneratorProps {
  contributions: Contribution[];
  userData: User;
  isLoading: boolean;
}

const StatementGenerator: React.FC<StatementGeneratorProps> = ({
  contributions,
  userData,
  isLoading
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const filteredContributions = contributions.filter(contribution => {
    if (!startDate || !endDate) return true;
    
    const contributionDate = new Date(contribution.date);
    return contributionDate >= startDate && contributionDate <= endDate;
  });

  const calculateTotals = () => {
    const mandatory = filteredContributions
      .filter(c => c.type === 'mandatory' && c.status === 'pending')
      .reduce((sum, c) => sum + c.amount, 0);
    
    const voluntary = filteredContributions
      .filter(c => c.type === 'voluntary' && c.status === 'pending')
      .reduce((sum, c) => sum + c.amount, 0);
      
    return { mandatory, voluntary, total: mandatory + voluntary };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  const generatePDF = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        const totals = calculateTotals();
        const doc = new jsPDF();
        
        // Add header
        doc.setFontSize(18);
        doc.text('Pension Contribution Statement', 105, 20, { align: 'center' });
        
        // Add member information
        doc.setFontSize(12);
        doc.text(`Member: ${userData.fullName}`, 20, 40);
        // doc.text(`Member ID: ${userData.membershipId}`, 20, 48);
        doc.text(`Date Range: ${startDate ? formatDate(startDate) : 'All'} to ${endDate ? formatDate(endDate) : 'All'}`, 20, 56);
        doc.text(`Generated On: ${formatDate(new Date())}`, 20, 64);
        
        // Add summary
        doc.setFontSize(14);
        doc.text('Summary', 20, 80);
        doc.setFontSize(12);
        doc.text(`Total Mandatory Contributions: ${formatCurrency(totals.mandatory)}`, 20, 88);
        doc.text(`Total Voluntary Contributions: ${formatCurrency(totals.voluntary)}`, 20, 96);
        doc.text(`Total Contributions: ${formatCurrency(totals.total)}`, 20, 104);
        
        // Add contribution details table
        doc.setFontSize(14);
        doc.text('Contribution Details', 20, 120);
        
        const tableColumn = ["Date", "Type", "Amount", "Status"];
        const tableRows = filteredContributions.map(c => [
          formatDate(c.date),
          c.type,
          formatCurrency(c.amount),
          c.status
        ]);
        
        (doc as any).autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 125,
          theme: 'grid',
          styles: { fontSize: 10 },
          headStyles: { fillColor: [66, 66, 99] }
        });
        
        // Save the PDF
        doc.save(`pension_statement_${new Date().getTime()}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate sending email
    setTimeout(() => {
      setIsGenerating(false);
      setEmailSent(true);
      setTimeout(() => {
        setShowEmailForm(false);
        setEmailSent(false);
        setEmailTo('');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Generate Statement</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Select Date Range</h3>
        <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Statement Summary</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Mandatory', 'Voluntary', 'Total'].map((type, index) => {
                  const totals = calculateTotals();
                  const amount = type === 'Mandatory' 
                    ? totals.mandatory 
                    : type === 'Voluntary' 
                      ? totals.voluntary 
                      : totals.total;
                  
                  return (
                    <div key={index} className="bg-white p-4 rounded-md shadow">
                      <p className="text-sm text-gray-500">{type} Contributions</p>
                      <p className="text-xl font-bold text-gray-800">{formatCurrency(amount)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Date Range:</span> {startDate ? formatDate(startDate) : 'All'} to {endDate ? formatDate(endDate) : 'All'}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Total Records:</span> {filteredContributions.length}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <button
          onClick={generatePDF}
          disabled={isGenerating || isLoading}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </>
          )}
        </button>

        <button
          onClick={() => setShowEmailForm(true)}
          disabled={isGenerating || isLoading}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-50 disabled:text-indigo-400"
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email Statement
        </button>
      </div>

      {showEmailForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <button
              onClick={() => setShowEmailForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-medium text-gray-900 mb-4">Email Statement</h3>
            
            {emailSent ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                Statement has been emailed successfully!
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isGenerating ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Send Email'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Contribution Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                  </tr>
                ))
              ) : filteredContributions.length > 0 ? (
                filteredContributions.map((contribution, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(contribution.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        contribution.type === 'mandatory' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {contribution.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{formatCurrency(contribution.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        contribution.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : contribution.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {contribution.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No contribution data found for the selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatementGenerator;