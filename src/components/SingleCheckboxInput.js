import React from 'react';
import { Info } from 'lucide-react';

const SingleCheckboxInput = ({ id, label, tooltip, checked, onChange }) => {
  return (
    <div key={id} className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <label htmlFor={id} className="font-medium">{label}</label>
        {tooltip && (
          <div className="relative group">
            <Info size={16} className="text-slate-400 cursor-help" />
            <div className="absolute left-full bottom-0 ml-2 mb-1 w-72 p-3 bg-slate-700 rounded-lg text-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 border border-slate-600">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2 p-2 rounded-md border border-slate-700 bg-slate-800/30">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700"
        />
        <label htmlFor={id} className="text-sm text-slate-300">Performed / Present</label>
      </div>
    </div>
  );
};

export default SingleCheckboxInput;
