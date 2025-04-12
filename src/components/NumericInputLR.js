import React from 'react';
import { Info } from 'lucide-react';

const NumericInputLR = ({
  param,
  label,
  unit,
  tooltip,
  rangeLabel,
  valueRight,
  valueLeft,
  onChange,
  getStatusColor, // Pass coloring function
  getRangeStatus, // Pass status function
  disabled = false
}) => {
  return (
    <div key={param} className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <label className={`font-medium ${disabled ? 'text-slate-500' : ''}`}>{label}</label>
        {tooltip && (
          <div className="relative group">
            <Info size={16} className="text-slate-400 cursor-help" />
            <div className="absolute left-full bottom-0 ml-2 mb-1 w-72 p-3 bg-slate-700 rounded-lg text-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 border border-slate-600">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      {/* Responsive Grid: Stacks on small, side-by-side on medium+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`flex items-center space-x-2 p-2 rounded-md border ${getStatusColor(getRangeStatus(valueRight, param))}`}>
          <span className="w-10 md:w-12 text-right text-sm">Right:</span>
          <input
            type="number"
            step="any"
            value={valueRight ?? ''}
            onChange={(e) => !disabled && onChange(param, 'right', e.target.value)}
            disabled={disabled}
            className={`w-full flex-grow px-2 py-1 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={disabled ? '-' : '0'}
          />
          <span className="text-sm">{unit}</span>
        </div>
        <div className={`flex items-center space-x-2 p-2 rounded-md border ${getStatusColor(getRangeStatus(valueLeft, param))}`}>
          <span className="w-10 md:w-12 text-right text-sm">Left:</span>
          <input
            type="number"
            step="any"
            value={valueLeft ?? ''}
            onChange={(e) => !disabled && onChange(param, 'left', e.target.value)}
            disabled={disabled}
            className={`w-full flex-grow px-2 py-1 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={disabled ? '-' : '0'}
          />
          <span className="text-sm">{unit}</span>
        </div>
      </div>
      {rangeLabel && <div className="text-right text-xs text-slate-400 mt-1 pr-2">Ref: {rangeLabel}</div>}
    </div>
  );
};

export default NumericInputLR;
