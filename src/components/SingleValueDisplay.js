import React from 'react';
import { Info } from 'lucide-react';

// Component to display single calculated or read-only values
const SingleValueDisplay = ({ param, label, unit, tooltip, rangeLabel, value, getStatusColor, getRangeStatus }) => {
  const displayValue = (value !== '' && value !== null && !isNaN(parseFloat(value))) ? `${value}${unit || ''}` : '-';
  const status = getRangeStatus ? getRangeStatus(value, param) : 'neutral';
  const colorClass = getStatusColor ? getStatusColor(status) : getStatusColor('neutral'); // Use neutral if functions aren't passed

  return (
    <div key={param} className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <label className="font-medium">{label}</label>
        {tooltip && (
          <div className="relative group">
            <Info size={16} className="text-slate-400 cursor-help" />
            <div className="absolute left-full bottom-0 ml-2 mb-1 w-72 p-3 bg-slate-700 rounded-lg text-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 border border-slate-600">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className={`flex items-center space-x-2 p-2 rounded-md border ${colorClass}`}>
        <input
          type="text"
          value={displayValue}
          readOnly
          className="w-full flex-grow px-2 py-1 bg-slate-900/50 border-0 rounded-md focus:outline-none text-center text-slate-200 font-medium"
          placeholder="-"
        />
      </div>
      {rangeLabel && <div className="text-right text-xs text-slate-400 mt-1 pr-2">Ref: {rangeLabel}</div>}
    </div>
  );
};

export default SingleValueDisplay;
