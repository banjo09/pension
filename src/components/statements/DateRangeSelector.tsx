import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangeSelectorProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onDateRangeChange,
  initialStartDate = null,
  initialEndDate = null
}) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');

  useEffect(() => {
    onDateRangeChange(startDate, endDate);
  }, [startDate, endDate, onDateRangeChange]);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setSelectedPreset('custom');
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setSelectedPreset('custom');
  };

  const applyPreset = (preset: string) => {
    const today = new Date();
    let newStartDate: Date | null = null;
    let newEndDate: Date | null = today;

    switch (preset) {
      case 'last30days':
        newStartDate = new Date();
        newStartDate.setDate(today.getDate() - 30);
        break;
      case 'last90days':
        newStartDate = new Date();
        newStartDate.setDate(today.getDate() - 90);
        break;
      case 'lastYear':
        newStartDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        break;
      case 'yearToDate':
        newStartDate = new Date(today.getFullYear(), 0, 1);
        break;
      case 'allTime':
        newStartDate = null;
        newEndDate = null;
        break;
      default:
        // For 'custom', don't change the dates
        return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setSelectedPreset(preset);
    onDateRangeChange(newStartDate, newEndDate);
  };

  const presets = [
    { id: 'last30days', label: 'Last 30 Days' },
    { id: 'last90days', label: 'Last 90 Days' },
    { id: 'lastYear', label: 'Last Year' },
    { id: 'yearToDate', label: 'Year to Date' },
    { id: 'allTime', label: 'All Time' }
  ];

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {presets.map(preset => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              selectedPreset === preset.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="w-full md:w-1/2 mb-2 md:mb-0">
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <DatePicker
              id="start-date"
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={new Date()}
              placeholderText="Select start date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              dateFormat="dd/MM/yyyy"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <div className="relative">
            <DatePicker
              id="end-date"
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate as Date | undefined}
              maxDate={new Date()}
              placeholderText="Select end date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              dateFormat="dd/MM/yyyy"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2 text-sm text-gray-600">
        <div>
          {startDate && endDate ? (
            <span>
              Selected: <strong>{formatDate(startDate)}</strong> to <strong>{formatDate(endDate)}</strong>
            </span>
          ) : startDate ? (
            <span>
              From <strong>{formatDate(startDate)}</strong> onwards
            </span>
          ) : endDate ? (
            <span>
              Until <strong>{formatDate(endDate)}</strong>
            </span>
          ) : (
            <span>No date range selected (showing all records)</span>
          )}
        </div>
        
        <button
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
            setSelectedPreset('allTime');
            onDateRangeChange(null, null);
          }}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Clear Dates
        </button>
      </div>
    </div>
  );
};

export default DateRangeSelector;