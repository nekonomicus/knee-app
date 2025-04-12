import React from 'react';
import { Info } from 'lucide-react';

const BeightonCheckboxLR = ({ param, label, tooltip, checkedRight, checkedLeft, onChange }) => {
  return (
    <div key={param} className="mb-2">
      <div className="flex items-center gap-2 mb-1">
        <label className="font-medium text-sm">{label}</label>
        {tooltip && (
          <div className="relative group">
            <Info size={14} className="text-slate-400 cursor-help" />
            <div className="absolute left-full bottom-0 ml-2 mb-1 w-60 p-2 bg-slate-700 rounded-lg text-xs shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 border border-slate-600">
              {tooltip}
            </div>
          </div>
        )}
      </div>
       {/* Responsive Grid: Stacks on small, side-by-side on medium+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
        <div className="flex items-center space-x-2 pl-2">
          <input
            type="checkbox"
            id={`${param}-right`}
            checked={checkedRight}
            onChange={(e) => onChange(param, 'right', e.target.checked)}
            className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700"
          />
          <label htmlFor={`${param}-right`} className="text-xs">Right</label>
        </div>
        <div className="flex items-center space-x-2 pl-2">
          <input
            type="checkbox"
            id={`${param}-left`}
            checked={checkedLeft}
            onChange={(e) => onChange(param, 'left', e.target.checked)}
            className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700"
          />
          <label htmlFor={`${param}-left`} className="text-xs">Left</label>
        </div>
      </div>
    </div>
  );
};

export default BeightonCheckboxLR;
