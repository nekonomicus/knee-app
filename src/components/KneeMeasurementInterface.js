import React, { useState } from 'react';
import { Info, Clipboard, Check } from 'lucide-react';

const KneeMeasurementInterface = () => {
  const [copied, setCopied] = useState(false);
  const [measurements, setMeasurements] = useState({
    mri: { right: false, left: false },
    xrayEOS: { right: false, left: false },
    femoralTorsion: { right: '', left: '' },
    tibialTorsion: { right: '', left: '' },
    legLength: { right: '', left: '' },
    patellaHeightInsallSalvati: { right: '', left: '' },
    catonDeschampsIndex: { right: '', left: '' },
    patellaTrochleaIndex: { right: '', left: '' },
    tttgDistanceCT: { right: '', left: '' }, // Added CT/MRI distinction for clarity
    tttgDistanceMRI: { right: '', left: '' },
    tttgIndex: { right: '', left: '' },
    ttpclDistance: { right: '', left: '' },
    patellaTilt: { right: '', left: '' },
    genuValgum: { right: '', left: '' },
  });

  // --- Tooltips (Enhanced Explanations) ---
  const tooltips = {
    mri: "Check if MRI was performed. Often used for soft tissues (MPFL, cartilage) and specific measurements like Patella-Trochlea Index.",
    xrayEOS: "Check if X-Ray or EOS was performed. Used for bone morphology, alignment, and height indices (e.g., Caton-Deschamps, Insall-Salvati).",
    femoralTorsion: "Femoral Torsion/Antetorsion (°): Measures twist of the femur. Normal ~15°. Pathological if >25-30°. Measured via CT/MRI (e.g., Waidelich: Norm 20.4° ± 9°). Enter measured value.",
    tibialTorsion: "Tibial Torsion (°): Measures twist of the tibia. External torsion >40° can be significant. Measured via CT/MRI. Enter measured value.",
    legLength: "Leg Length (mm): Typically measured on full-leg standing X-ray/EOS. Enter measured length or difference if relevant.",
    patellaHeightInsallSalvati: "Insall-Salvati Index: Ratio of patellar tendon length to patella length on lateral X-ray. Normal ≤1.2. >1.2 indicates Patella Alta.",
    catonDeschampsIndex: "Caton-Deschamps Index: Ratio of distance from lower patellar pole to tibial plateau / patellar articular surface length on lateral X-ray. Normal ≤1.2. >1.3 indicates Patella Alta requiring potential distalization.",
    patellaTrochleaIndex: "Patella-Trochlea Index (PTI - Biedert): Percentage of cartilage overlap on sagittal MRI. Normal ≥12.5%. <12.5% associated with instability.",
    tttgDistanceCT: "TT-TG Distance (CT) (mm): Distance between Tibial Tubercle and Trochlear Groove on axial CT. Normal ≤20mm. Values >20mm are pathological.",
    tttgDistanceMRI: "TT-TG Distance (MRI) (mm): Distance between Tibial Tubercle and Trochlear Groove on axial MRI (cartilage landmarks). Normal <8.7mm. Instability avg ~16.5mm.",
    tttgIndex: "TT-TG Index: Ratio of TT-TG / TT-TE (Trochlear Entrance distance) on axial CT/MRI, adjusts for knee size. Normal <0.23. >0.23 is pathological.",
    ttpclDistance: "TT-PCL Distance (mm): Distance between Tibial Tubercle and medial border of PCL on axial CT/MRI. Normal <24mm. Helps differentiate tibial vs. trochlear cause of high TT-TG.",
    patellaTilt: "Patella Tilt (°): Angle of patella relative to posterior condylar line on axial CT/MRI. Normal ≤20°. >20° is a risk factor.",
    genuValgum: "Genu Valgum (°): Valgus angle of the knee, measured on full-leg standing X-ray/EOS. Enter measured angle. Significant valgus is a risk factor (e.g., >7°).",
  };

  // --- Normal Ranges for Coloring ---
  // Note: These are simplified for coloring; clinical significance involves context.
  const normalRanges = {
    femoralTorsion: { low: 7, high: 25 }, // Using a broader range for 'normal' color
    tibialTorsion: { low: 10, high: 40 }, // Broad range
    patellaHeightInsallSalvati: { low: 0, high: 1.2 },
    catonDeschampsIndex: { low: 0, high: 1.2 },
    patellaTrochleaIndex: { low: 12.5, high: 100 }, // Lower bound is key
    tttgDistanceCT: { low: 0, high: 20 },
    tttgDistanceMRI: { low: 0, high: 15 }, // Slightly lower MRI threshold for coloring
    tttgIndex: { low: 0, high: 0.23 },
    ttpclDistance: { low: 0, high: 24 },
    patellaTilt: { low: -Infinity, high: 20 }, // Allow negative tilt as normal
    genuValgum: { low: 0, high: 7 }, // Example normal range
  };

  // --- Display Labels for Reference Ranges ---
  const rangeLabels = {
    femoralTorsion: "~15° (Path >25-30°)",
    tibialTorsion: "Norm Varies (Path >40°)",
    legLength: "N/A",
    patellaHeightInsallSalvati: "≤1.2",
    catonDeschampsIndex: "≤1.2 (Alta >1.3)",
    patellaTrochleaIndex: "≥12.5%",
    tttgDistanceCT: "≤20 mm",
    tttgDistanceMRI: "<15 mm (approx)",
    tttgIndex: "<0.23",
    ttpclDistance: "<24 mm",
    patellaTilt: "≤20°",
    genuValgum: "<7° (approx)",
  };

  // --- Input Change Handler ---
  const handleInputChange = (param, side, value) => {
    setMeasurements(prev => ({
      ...prev,
      [param]: {
        ...prev[param],
        [side]: value
      }
    }));
  };

  // --- Status Logic ---
  const getRangeStatus = (value, type) => {
    if (value === '' || value === null || !normalRanges[type]) return 'neutral';
    const num = parseFloat(value);
    if (isNaN(num)) return 'neutral';

    const range = normalRanges[type];
    // Specific logic for PTI where lower is abnormal
    if (type === 'patellaTrochleaIndex') {
        return num >= range.low ? 'normal' : 'low';
    }
    // Standard low/high/normal
    if (num < range.low) return 'low';
    if (num > range.high) return 'high';
    return 'normal';
  };

  const getBooleanStatus = (value) => {
    // Example: Could be used for flags like "Trochlear Dysplasia Present" if added later
    if (value === true) return 'abnormal';
    if (value === false) return 'normal';
    return 'neutral';
  };

  const getStatusColor = (status) => {
    const colors = {
      low: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400',
      high: 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400',
      normal: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
      abnormal: 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400', // For boolean checks if needed
      neutral: 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-400'
    };
    return colors[status] || colors.neutral;
  };

  // --- Copy to Clipboard ---
  const copyToClipboard = () => {
    const parameters = [
      { key: 'mri', label: 'MRI Performed' },
      { key: 'xrayEOS', label: 'X-Ray/EOS Performed' },
      { key: 'femoralTorsion', label: 'Femoral Torsion (°)', unit: '°' },
      { key: 'tibialTorsion', label: 'Tibial Torsion (°)', unit: '°' },
      { key: 'legLength', label: 'Leg Length (mm)', unit: 'mm' },
      { key: 'patellaHeightInsallSalvati', label: 'Patella Height (Insall-Salvati)', unit: '' },
      { key: 'catonDeschampsIndex', label: 'Patella Height (Caton-Deschamps)', unit: '' },
      { key: 'patellaTrochleaIndex', label: 'Patella-Trochlea Index (%)', unit: '%' },
      { key: 'tttgDistanceCT', label: 'TT-TG Distance (CT) (mm)', unit: 'mm' },
      { key: 'tttgDistanceMRI', label: 'TT-TG Distance (MRI) (mm)', unit: 'mm' },
      { key: 'tttgIndex', label: 'TT-TG Index', unit: '' },
      { key: 'ttpclDistance', label: 'TT-PCL Distance (mm)', unit: 'mm' },
      { key: 'patellaTilt', label: 'Patella Tilt (°)', unit: '°' },
      { key: 'genuValgum', label: 'Genu Valgum (°)', unit: '°' },
    ];

    const rows = [
      ['Parameter', 'Rechts', 'Links', 'Referenzbereich']
    ];

    parameters.forEach(({ key, label, unit }) => {
        const rightVal = measurements[key].right;
        const leftVal = measurements[key].left;
        const ref = rangeLabels[key] || '-';

        let rightDisplay, leftDisplay;

        if (typeof rightVal === 'boolean') {
            rightDisplay = rightVal ? 'Ja' : 'Nein';
            leftDisplay = leftVal ? 'Ja' : 'Nein';
        } else {
            rightDisplay = rightVal !== '' ? `${rightVal}${unit || ''}` : '-';
            leftDisplay = leftVal !== '' ? `${leftVal}${unit || ''}` : '-';
        }

        // Special case for leg length - often reported as difference or side-specific
        if (key === 'legLength') {
           rightDisplay = rightVal || '-';
           leftDisplay = leftVal || '-';
        }


        rows.push([label, rightDisplay, leftDisplay, ref]);
    });

    // Create HTML table
    let htmlTable = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; font-family: sans-serif; border: 1px solid #ddd;">';
    htmlTable += '<thead><tr>';
    rows[0].forEach(header => {
      htmlTable += `<th style="background-color: #f2f2f2; font-weight: bold; padding: 8px; border: 1px solid #ddd; text-align: left;">${header}</th>`;
    });
    htmlTable += '</tr></thead><tbody>';

    for (let i = 1; i < rows.length; i++) {
      htmlTable += '<tr>';
      rows[i].forEach((cell, index) => {
        const style = index === 0
            ? 'font-weight: bold; padding: 8px; border: 1px solid #ddd;'
            : 'padding: 8px; border: 1px solid #ddd;';
        htmlTable += `<td style="${style}">${cell}</td>`;
      });
      htmlTable += '</tr>';
    }
    htmlTable += '</tbody></table>';

    // Create plain text version
    let plainText = '';
    rows.forEach(row => {
        plainText += row.map(cell => `"${cell.replace(/"/g, '""')}"`).join('\t') + '\n'; // CSV-like tab separated
    });


    // Use Clipboard API
    try {
        const blobHtml = new Blob([htmlTable], { type: 'text/html' });
        const blobText = new Blob([plainText], { type: 'text/plain' });
        const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];

        navigator.clipboard.write(data).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
             console.error('Async: Could not copy text: ', err);
             // Fallback for specific errors or environments
             fallbackCopyTextToClipboard(plainText);
        });
    } catch (err) {
        console.error('Could not copy text: ', err);
        fallbackCopyTextToClipboard(plainText);
    }
  };

  // Fallback copy function
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  // --- Helper to render inputs ---
  const renderNumericInput = (param, label, unit) => (
    <div key={param} className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <label className="font-medium">{label}</label>
        <div className="relative group">
          <Info size={16} className="text-slate-400 cursor-help" />
          <div className="absolute left-full bottom-0 ml-2 mb-1 w-72 p-3 bg-slate-700 rounded-md text-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10">
            {tooltips[param]}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={`flex items-center space-x-2 p-2 rounded-md border ${getStatusColor(getRangeStatus(measurements[param].right, param))}`}>
          <span className="w-16 text-right text-sm">Right:</span>
          <input
            type="number"
            step="any" // Allow decimals
            value={measurements[param].right}
            onChange={(e) => handleInputChange(param, 'right', e.target.value)}
            className="flex-grow px-2 py-1 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
          <span className="text-sm">{unit}</span>
        </div>
        <div className={`flex items-center space-x-2 p-2 rounded-md border ${getStatusColor(getRangeStatus(measurements[param].left, param))}`}>
          <span className="w-16 text-right text-sm">Left:</span>
          <input
            type="number"
            step="any"
            value={measurements[param].left}
            onChange={(e) => handleInputChange(param, 'left', e.target.value)}
             className="flex-grow px-2 py-1 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
          <span className="text-sm">{unit}</span>
        </div>
      </div>
       <div className="text-right text-xs text-slate-400 mt-1 pr-2">Ref: {rangeLabels[param]}</div>
    </div>
  );

 const renderCheckboxInput = (param, label) => (
    <div key={param} className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <label className="font-medium">{label}</label>
        <div className="relative group">
            <Info size={16} className="text-slate-400 cursor-help" />
            <div className="absolute left-full bottom-0 ml-2 mb-1 w-72 p-3 bg-slate-700 rounded-md text-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10">
                {tooltips[param]}
            </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 p-2">
          <span className="w-16 text-right text-sm">Right:</span>
          <input
            type="checkbox"
            checked={measurements[param].right}
            onChange={(e) => handleInputChange(param, 'right', e.target.checked)}
            className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2 p-2">
          <span className="w-16 text-right text-sm">Left:</span>
          <input
            type="checkbox"
            checked={measurements[param].left}
            onChange={(e) => handleInputChange(param, 'left', e.target.checked)}
            className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  // --- JSX Structure ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900/70 border-b border-slate-700 flex justify-between items-center">
           <div>
             <h1 className="text-2xl md:text-3xl font-bold text-white">Knee Radiographic Parameters</h1>
             <p className="text-sm text-slate-400 mt-1">Enter values below. Inputs highlight based on typical ranges.</p>
           </div>
           <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-md disabled:opacity-50"
            disabled={copied}
          >
            {copied ? <Check size={18} /> : <Clipboard size={18} />}
            {copied ? 'Copied!' : 'Copy Summary'}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
             {/* Imaging Modalities */}
            <section className="p-5 bg-slate-800/60 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Imaging</h2>
              {renderCheckboxInput('mri', 'MRI Performed')}
              {renderCheckboxInput('xrayEOS', 'X-Ray/EOS Performed')}
            </section>

            {/* Torsion */}
            <section className="p-5 bg-slate-800/60 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Torsion</h2>
              {renderNumericInput('femoralTorsion', 'Femoral Torsion', '°')}
              {renderNumericInput('tibialTorsion', 'Tibial Torsion', '°')}
            </section>

            {/* Other */}
            <section className="p-5 bg-slate-800/60 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Other</h2>
              {renderNumericInput('legLength', 'Leg Length', 'mm')}
               {renderNumericInput('genuValgum', 'Genu Valgum', '°')}
           </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
             {/* Patella Height */}
             <section className="p-5 bg-slate-800/60 rounded-lg border border-slate-700">
               <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Patella Height</h2>
               {renderNumericInput('patellaHeightInsallSalvati', 'Insall-Salvati Index', '')}
               {renderNumericInput('catonDeschampsIndex', 'Caton-Deschamps Index', '')}
               {renderNumericInput('patellaTrochleaIndex', 'Patella-Trochlea Index (PTI)', '%')}
             </section>

            {/* Alignment */}
            <section className="p-5 bg-slate-800/60 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Patellar Alignment</h2>
               {renderNumericInput('tttgDistanceCT', 'TT-TG Distance (CT)', 'mm')}
               {renderNumericInput('tttgDistanceMRI', 'TT-TG Distance (MRI)', 'mm')}
               {renderNumericInput('tttgIndex', 'TT-TG Index', '')}
               {renderNumericInput('ttpclDistance', 'TT-PCL Distance', 'mm')}
               {renderNumericInput('patellaTilt', 'Patella Tilt', '°')}
            </section>
          </div>
        </div>

         {/* Summary Table (optional visualization) */}
         {/* You can uncomment this if you want the live table at the bottom */}
         {/*
         <div className="p-6 border-t border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Live Summary</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-700">
               <table className="w-full text-sm">
                  <thead className="bg-slate-700/50">
                     <tr>
                        <th className="text-left p-3 font-semibold">Parameter</th>
                        <th className="text-center p-3 font-semibold">Rechts</th>
                        <th className="text-center p-3 font-semibold">Links</th>
                        <th className="text-center p-3 font-semibold">Referenzbereich</th>
                     </tr>
                  </thead>
                  <tbody className="bg-slate-800/50">
                     {parameters.map(({ key, label, unit }) => {
                        const rightVal = measurements[key].right;
                        const leftVal = measurements[key].left;
                        const ref = rangeLabels[key] || '-';
                        let rightDisplay, leftDisplay;
                        if (typeof rightVal === 'boolean') {
                            rightDisplay = rightVal ? '✔️' : '❌';
                            leftDisplay = leftVal ? '✔️' : '❌';
                        } else {
                            rightDisplay = rightVal !== '' ? `${rightVal}${unit || ''}` : '-';
                            leftDisplay = leftVal !== '' ? `${leftVal}${unit || ''}` : '-';
                        }
                         if (key === 'legLength') {
                             rightDisplay = rightVal || '-';
                             leftDisplay = leftVal || '-';
                         }

                        return (
                           <tr key={key} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/30">
                              <td className="p-3 font-medium">{label}</td>
                              <td className={`text-center p-3 ${getRangeStatus(rightVal, key) !== 'neutral' ? getStatusColor(getRangeStatus(rightVal, key)) : ''}`}>{rightDisplay}</td>
                              <td className={`text-center p-3 ${getRangeStatus(leftVal, key) !== 'neutral' ? getStatusColor(getRangeStatus(leftVal, key)) : ''}`}>{leftDisplay}</td>
                              <td className="text-center p-3 text-slate-400">{ref}</td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>
         */}
      </div>
    </div>
  );
};

export default KneeMeasurementInterface;
