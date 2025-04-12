import React, { useState, useEffect } from 'react';
import { Info, Clipboard, Check } from 'lucide-react';

const KneeMeasurementInterface = () => {
  const [copied, setCopied] = useState(false);
  const [measurements, setMeasurements] = useState({
    // Imaging
    mri: { right: false, left: false },
    xrayEOS: { right: false, left: false },
    ctPerformed: { right: false, left: false }, // Added CT Checkbox
    // Torsion
    femoralTorsion: { right: '', left: '' },
    tibialTorsion: { right: '', left: '' },
    // Length
    legLength: { right: '', left: '' },
    // Patella Height
    patellaHeightInsallSalvati: { right: '', left: '' },
    catonDeschampsIndex: { right: '', left: '' },
    patellaTrochleaIndex: { right: '', left: '' },
    // Alignment
    tttgDistanceCT: { right: '', left: '' },
    tttgDistanceMRI: { right: '', left: '' },
    tttgIndex: { right: '', left: '' },
    ttpclDistance: { right: '', left: '' },
    patellaTilt: { right: '', left: '' },
    // Other
    genuValgum: { right: '', left: '' },
    // Beighton Score Components
    beightonPinky: { right: false, left: false },
    beightonThumb: { right: false, left: false },
    beightonElbow: { right: false, left: false },
    beightonKnee: { right: false, left: false },
    beightonTrunk: { value: false }, // Only one value needed
  });

  const [legLengthDifference, setLegLengthDifference] = useState('');
  const [beightonTotalScore, setBeightonTotalScore] = useState(0);

  // --- Tooltips (Revised for Clarity) ---
  const tooltips = {
    mri: "MRI: Check if Magnetic Resonance Imaging was performed. Used for soft tissue detail (cartilage, ligaments like MPFL) and specific indices (e.g., Patella-Trochlea Index).",
    xrayEOS: "X-Ray/EOS: Check if standard Radiography or EOS (low-dose, standing) was performed. Used for bone morphology, overall alignment (valgus/varus), and height indices (Caton-Deschamps, Insall-Salvati).",
    ctPerformed: "CT: Check if Computed Tomography was performed. Often used for precise bone measurements like Torsion and TT-TG distance.",
    femoralTorsion: "Femoral Torsion (°): Axial rotation (twist) of the femur, measured via CT or MRI. Normal range varies by method (e.g., Waidelich: ~10-25°). Values >25-30° indicate excessive anteversion, a risk factor for instability.",
    tibialTorsion: "Tibial Torsion (°): Axial rotation (twist) of the tibia, measured via CT or MRI. Excessive external torsion (>40°) can increase lateral pull on the patella.",
    legLength: "Leg Length (mm): Absolute length measured (e.g., on EOS). Difference between sides is often clinically relevant.",
    legLengthDifference: "Calculated difference between Right and Left leg lengths (Right - Left). A significant difference can affect biomechanics.",
    patellaHeightInsallSalvati: "Insall-Salvati Index: Patellar Tendon Length / Patella Length (Lateral X-Ray). Normal: ≤1.2. Values >1.2 indicate Patella Alta (high-riding).",
    catonDeschampsIndex: "Caton-Deschamps Index: Distance (Lower Patellar Pole to Tibial Plateau) / Patellar Articular Length (Lateral X-Ray). Normal: ≤1.2. Values >1.3 strongly suggest Patella Alta.",
    patellaTrochleaIndex: "Patella-Trochlea Index (PTI - Biedert %): Cartilage overlap between patella and trochlea (Sagittal MRI). Normal: ≥12.5%. Less overlap (<12.5%) indicates poor engagement and instability risk.",
    tttgDistanceCT: "TT-TG Distance (CT) (mm): Lateral offset of Tibial Tubercle relative to Trochlear Groove (Axial CT). Normal: ≤20mm. Measures extensor mechanism alignment.",
    tttgDistanceMRI: "TT-TG Distance (MRI) (mm): Lateral offset using cartilage landmarks (Axial MRI). Normal: <~15mm (use age-specific norms if available). Values >15-20mm are generally pathological.",
    tttgIndex: "TT-TG Index: Ratio TT-TG / TT-TE (distance to Trochlear Entrance), normalizes for knee size. Normal: <0.23. Higher values indicate relative lateralization.",
    ttpclDistance: "TT-PCL Distance (mm): Lateral distance from Tibial Tubercle to medial border of PCL (Axial CT/MRI). Normal: <24mm. Helps isolate tibial contribution to TT-TG.",
    patellaTilt: "Patella Tilt (°): Angle of patella relative to posterior condyles (Axial CT/MRI, often near extension). Normal: ≤20°. Excessive tilt (>20°) indicates lateral tightness or maltracking.",
    genuValgum: "Genu Valgum (°): Overall knee valgus angle (Frontal Plane, Standing X-Ray/EOS). Normal: ~5-7°. Excessive valgus increases lateral forces on the patella.",
    beightonScore: "Beighton Score (0-9): Assesses generalized joint hypermobility. Components: Pinky (>90° dorsiflexion), Thumb (to forearm), Elbow (>10° hyperextension), Knee (>10° hyperextension), Trunk (palms flat on floor). Score ≥5 (adults) or ≥6 (children) suggests hypermobility.",
    beightonPinky: "Beighton - Pinky: Passive dorsiflexion >90° (1pt/side).",
    beightonThumb: "Beighton - Thumb: Passive apposition to forearm (1pt/side).",
    beightonElbow: "Beighton - Elbow: Hyperextension >10° (1pt/side).",
    beightonKnee: "Beighton - Knee: Hyperextension >10° (1pt/side).",
    beightonTrunk: "Beighton - Trunk: Palms flat on floor, knees straight (1pt)."
  };

  // --- Normal Ranges (Simplified for Coloring) ---
  const normalRanges = {
    femoralTorsion: { low: 5, high: 25 },
    tibialTorsion: { low: 10, high: 40 },
    patellaHeightInsallSalvati: { low: 0.8, high: 1.2 }, // Added lower bound example
    catonDeschampsIndex: { low: 0.6, high: 1.2 }, // Added lower bound example
    patellaTrochleaIndex: { low: 12.5, high: 100 },
    tttgDistanceCT: { low: 0, high: 20 },
    tttgDistanceMRI: { low: 0, high: 15 },
    tttgIndex: { low: 0, high: 0.23 },
    ttpclDistance: { low: 0, high: 24 },
    patellaTilt: { low: -5, high: 20 }, // Allow some negative tilt
    genuValgum: { low: 0, high: 7 },
    beightonTotalScore: { low: 0, high: 4 } // Example adult threshold for 'normal' coloring
  };

  // --- Display Labels for Reference ---
  const rangeLabels = {
    femoralTorsion: "~10-25° (Path >25-30°)",
    tibialTorsion: "Varies (Path >40°)",
    legLength: "Diff: " + (legLengthDifference !== '' ? `${legLengthDifference} mm` : 'N/A'),
    patellaHeightInsallSalvati: "0.8-1.2",
    catonDeschampsIndex: "0.6-1.2 (Alta >1.3)",
    patellaTrochleaIndex: "≥12.5%",
    tttgDistanceCT: "≤20 mm",
    tttgDistanceMRI: "<15 mm (use age norms)",
    tttgIndex: "<0.23",
    ttpclDistance: "<24 mm",
    patellaTilt: "≤20°",
    genuValgum: "<7° (approx)",
    beightonTotalScore: "Score /9 (Hyper ≥5)"
  };

  // --- Calculate Leg Length Difference ---
  useEffect(() => {
    const rightLen = parseFloat(measurements.legLength.right);
    const leftLen = parseFloat(measurements.legLength.left);

    if (!isNaN(rightLen) && !isNaN(leftLen)) {
      setLegLengthDifference((rightLen - leftLen).toFixed(1)); // Calculate R - L difference
    } else {
      setLegLengthDifference('');
    }
  }, [measurements.legLength.right, measurements.legLength.left]);

  // --- Calculate Beighton Score ---
   useEffect(() => {
    let score = 0;
    if (measurements.beightonPinky.right) score++;
    if (measurements.beightonPinky.left) score++;
    if (measurements.beightonThumb.right) score++;
    if (measurements.beightonThumb.left) score++;
    if (measurements.beightonElbow.right) score++;
    if (measurements.beightonElbow.left) score++;
    if (measurements.beightonKnee.right) score++;
    if (measurements.beightonKnee.left) score++;
    if (measurements.beightonTrunk.value) score++;
    setBeightonTotalScore(score);
  }, [measurements.beightonPinky, measurements.beightonThumb, measurements.beightonElbow, measurements.beightonKnee, measurements.beightonTrunk]);


  // --- Input Change Handler ---
  const handleInputChange = (param, side, value) => {
     // Handle single value for trunk flexion
     if (param === 'beightonTrunk') {
         setMeasurements(prev => ({ ...prev, beightonTrunk: { value: value } }));
         return;
     }
     // Handle checkboxes for imaging
     if (param === 'mri' || param === 'xrayEOS' || param === 'ctPerformed') {
       // Simple true/false, no left/right differentiation needed for existence
       setMeasurements(prev => ({ ...prev, [param]: { value: value, right: value, left: value } })); // Keep right/left for compatibility but use value
       return;
     }
     // Handle other parameters with left/right sides
     setMeasurements(prev => ({
       ...prev,
       [param]: {
         ...prev[param],
         [side]: value
       }
     }));
  };

  // --- Status Logic (No Changes Needed Here) ---
   const getRangeStatus = (value, type) => {
    if (value === '' || value === null || !normalRanges[type]) return 'neutral';
    const num = parseFloat(value);
    if (isNaN(num)) return 'neutral';

    const range = normalRanges[type];
    // Specific logic for PTI where lower is abnormal
    if (type === 'patellaTrochleaIndex') {
        return num >= range.low ? 'normal' : 'low';
    }
    // Specific logic for Beighton Score where higher is abnormal
    if (type === 'beightonTotalScore') {
        return num <= range.high ? 'normal' : 'high'; // ≥5 is hypermobile/abnormal
    }
    // Standard low/high/normal
    if (num < range.low) return 'low';
    if (num > range.high) return 'high';
    return 'normal';
  };

  const getBooleanStatus = (value) => {
    if (value === true) return 'abnormal'; // Example: a 'positive' sign is abnormal
    if (value === false) return 'normal';
    return 'neutral';
  };

  const getStatusColor = (status) => {
    const colors = {
      low: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400',
      high: 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400',
      normal: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
      abnormal: 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400',
      neutral: 'bg-slate-800/10 border-slate-600' // Adjusted neutral border
    };
    return colors[status] || colors.neutral;
  };

  // --- Copy to Clipboard (Filtered Output) ---
  const copyToClipboard = () => {
    const allParameters = [
      // Imaging (Included if checked)
      { key: 'mri', label: 'MRI Performed', type: 'bool' },
      { key: 'xrayEOS', label: 'X-Ray/EOS Performed', type: 'bool' },
      { key: 'ctPerformed', label: 'CT Performed', type: 'bool' },
      // Torsion
      { key: 'femoralTorsion', label: 'Femoral Torsion (°)', unit: '°', type: 'num' },
      { key: 'tibialTorsion', label: 'Tibial Torsion (°)', unit: '°', type: 'num' },
      // Length (Include R/L if entered, include Diff if calculated)
      { key: 'legLength', label: 'Leg Length (mm)', unit: 'mm', type: 'num' },
      { key: 'legLengthDifference', label: 'Leg Length Diff (R-L) (mm)', unit: 'mm', type: 'calc', dependsOn: 'legLength' },
      // Patella Height
      { key: 'patellaHeightInsallSalvati', label: 'Patella Height (Insall-Salvati)', unit: '', type: 'num' },
      { key: 'catonDeschampsIndex', label: 'Patella Height (Caton-Deschamps)', unit: '', type: 'num' },
      { key: 'patellaTrochleaIndex', label: 'Patella-Trochlea Index (%)', unit: '%', type: 'num' },
      // Alignment
      { key: 'tttgDistanceCT', label: 'TT-TG Distance (CT) (mm)', unit: 'mm', type: 'num' },
      { key: 'tttgDistanceMRI', label: 'TT-TG Distance (MRI) (mm)', unit: 'mm', type: 'num' },
      { key: 'tttgIndex', label: 'TT-TG Index', unit: '', type: 'num' },
      { key: 'ttpclDistance', label: 'TT-PCL Distance (mm)', unit: 'mm', type: 'num' },
      { key: 'patellaTilt', label: 'Patella Tilt (°)', unit: '°', type: 'num' },
      // Other
      { key: 'genuValgum', label: 'Genu Valgum (°)', unit: '°', type: 'num' },
      // Beighton (Include total if > 0)
      { key: 'beightonTotalScore', label: 'Beighton Score (/9)', unit: '/9', type: 'calc', dependsOn: 'beighton' },
      // Can optionally include individual Beighton components if needed
      // { key: 'beightonPinky', label: 'Beighton Pinky', type: 'bool_lr' },
      // { key: 'beightonThumb', label: 'Beighton Thumb', type: 'bool_lr' },
      // { key: 'beightonElbow', label: 'Beighton Elbow', type: 'bool_lr' },
      // { key: 'beightonKnee', label: 'Beighton Knee', type: 'bool_lr' },
      // { key: 'beightonTrunk', label: 'Beighton Trunk Flexion', type: 'bool' },
    ];

    // Filter parameters to include only those with data
    const includedParameters = allParameters.filter(p => {
        if (p.type === 'bool') return measurements[p.key]?.value === true;
        if (p.type === 'bool_lr') return measurements[p.key]?.right === true || measurements[p.key]?.left === true; // Include if either side is true for Beighton components if added
        if (p.type === 'num') return measurements[p.key]?.right !== '' || measurements[p.key]?.left !== '';
        if (p.type === 'calc') {
             if (p.key === 'legLengthDifference') return legLengthDifference !== '';
             if (p.key === 'beightonTotalScore') return beightonTotalScore > 0; // Only include Beighton score if positive
        }
        return false; // Default exclude
    });

    if (includedParameters.length === 0) {
        console.log("No data entered to copy."); // Handle case with no data
        // Optionally provide user feedback
        alert("No data entered to copy.");
        return;
    }

    const rows = [
      ['Parameter', 'Rechts', 'Links', 'Referenzbereich']
    ];

    includedParameters.forEach(({ key, label, unit, type }) => {
        let rightVal = measurements[key]?.right ?? measurements[key]?.value; // Handle single value keys like bools and trunk
        let leftVal = measurements[key]?.left ?? measurements[key]?.value;
        const ref = rangeLabels[key] || '-';
        let rightDisplay = '-';
        let leftDisplay = '-';

        if (key === 'legLengthDifference') {
            rightDisplay = legLengthDifference !== '' ? `${legLengthDifference}${unit || ''}` : '-';
            leftDisplay = ''; // Difference is a single value
        } else if (key === 'beightonTotalScore') {
             rightDisplay = beightonTotalScore !== '' ? `${beightonTotalScore}${unit || ''}` : '-';
             leftDisplay = ''; // Total score is single value
        } else if (type === 'bool' || key === 'beightonTrunk') { // Handle single bools
            rightDisplay = rightVal ? 'Ja' : 'Nein';
            leftDisplay = ''; // Booleans often apply generally or have single value
        } else if (type === 'bool_lr') { // Handle LR bools if added
             rightDisplay = rightVal ? 'Ja' : 'Nein';
             leftDisplay = leftVal ? 'Ja' : 'Nein';
        } else { // Handle numeric R/L
            rightDisplay = rightVal !== '' ? `${rightVal}${unit || ''}` : '-';
            leftDisplay = leftVal !== '' ? `${leftVal}${unit || ''}` : '-';
        }

        // Special case for leg length display
        if (key === 'legLength') {
             rightDisplay = measurements.legLength.right || '-';
             leftDisplay = measurements.legLength.left || '-';
        }

        rows.push([label, rightDisplay, leftDisplay, ref]);
    });


    // --- HTML & Text Table Generation (Same as before) ---
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
         // Center align R/L/Ref columns
         const textAlign = index > 0 ? ' text-align: center;' : '';
        htmlTable += `<td style="${style}${textAlign}">${cell}</td>`;
      });
      htmlTable += '</tr>';
    }
    htmlTable += '</tbody></table>';

    let plainText = '';
    rows.forEach(row => {
        plainText += row.map(cell => `"${(cell ?? '').toString().replace(/"/g, '""')}"`).join('\t') + '\n';
    });

    // --- Clipboard API Call (Same as before) ---
    try {
        const blobHtml = new Blob([htmlTable], { type: 'text/html' });
        const blobText = new Blob([plainText], { type: 'text/plain' });
        const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];

        navigator.clipboard.write(data).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
             console.error('Async: Could not copy text: ', err);
             fallbackCopyTextToClipboard(plainText);
        });
    } catch (err) {
        console.error('Could not copy text: ', err);
        fallbackCopyTextToClipboard(plainText);
    }
  };

  // Fallback copy function (Same as before)
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
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


  // --- Render Helpers ---
  const renderNumericInput = (param, label, unit, disabled = false) => (
    <div key={param} className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <label className={`font-medium ${disabled ? 'text-slate-500' : ''}`}>{label}</label>
        {tooltips[param] && (
            <div className="relative group">
            <Info size={16} className="text-slate-400 cursor-help" />
            <div className="absolute left-full bottom-0 ml-2 mb-1 w-72 p-3 bg-slate-700 rounded-lg text-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 border border-slate-600">
                {tooltips[param]}
            </div>
            </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={`flex items-center space-x-2 p-2 rounded-md border ${getStatusColor(getRangeStatus(measurements[param]?.right, param))}`}>
          <span className="w-16 text-right text-sm">Right:</span>
          <input
            type="number"
            step="any"
            value={measurements[param]?.right ?? ''}
            onChange={(e) => !disabled && handleInputChange(param, 'right', e.target.value)}
            disabled={disabled}
            className={`flex-grow px-2 py-1 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={disabled ? '-' : '0'}
          />
          <span className="text-sm">{unit}</span>
        </div>
        <div className={`flex items-center space-x-2 p-2 rounded-md border ${getStatusColor(getRangeStatus(measurements[param]?.left, param))}`}>
          <span className="w-16 text-right text-sm">Left:</span>
          <input
            type="number"
            step="any"
            value={measurements[param]?.left ?? ''}
            onChange={(e) => !disabled && handleInputChange(param, 'left', e.target.value)}
            disabled={disabled}
            className={`flex-grow px-2 py-1 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={disabled ? '-' : '0'}
          />
          <span className="text-sm">{unit}</span>
        </div>
      </div>
       <div className="text-right text-xs text-slate-400 mt-1 pr-2">Ref: {rangeLabels[param]}</div>
    </div>
  );

 const renderSingleValueNumericInput = (param, label, unit, value, readOnly = true) => (
     <div key={param} className="mb-4">
        <div className="flex items-center gap-2 mb-2">
            <label className="font-medium">{label}</label>
            {tooltips[param] && (
                <div className="relative group">
                <Info size={16} className="text-slate-400 cursor-help" />
                <div className="absolute left-full bottom-0 ml-2 mb-1 w-72 p-3 bg-slate-700 rounded-lg text-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 border border-slate-600">
                    {tooltips[param]}
                </div>
                </div>
            )}
        </div>
        <div className={`flex items-center space-x-2 p-2 rounded-md border ${getStatusColor(getRangeStatus(value, param))}`}>
            <input
                type="text" // Use text for display consistency, maybe number if editable
                value={value !== '' && !isNaN(parseFloat(value)) ? `${value}${unit || ''}` : '-'}
                readOnly={readOnly}
                className="flex-grow px-2 py-1 bg-slate-900 border-0 rounded-md focus:outline-none text-center"
                placeholder="-"
            />
        </div>
         {rangeLabels[param] && <div className="text-right text-xs text-slate-400 mt-1 pr-2">Ref: {rangeLabels[param]}</div>}
    </div>
 );


 const renderCheckboxInput = (param, label) => (
    <div key={param} className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <label className="font-medium">{label}</label>
        {tooltips[param] && (
            <div className="relative group">
                <Info size={16} className="text-slate-400 cursor-help" />
                <div className="absolute left-full bottom-0 ml-2 mb-1 w-72 p-3 bg-slate-700 rounded-lg text-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 border border-slate-600">
                    {tooltips[param]}
                </div>
            </div>
         )}
      </div>
      {/* Simplified checkbox - assumes general applicability, not L/R */}
       <div className="flex items-center space-x-2 p-2">
           <input
            type="checkbox"
            id={param} // Add id for label association
            checked={measurements[param]?.value ?? false}
            onChange={(e) => handleInputChange(param, null, e.target.checked)} // Pass null for side
            className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700"
           />
           <label htmlFor={param} className="text-sm">Performed / Present</label>
        </div>
    </div>
  );

   const renderBeightonCheckbox = (param, label) => (
     <div key={param} className="mb-1">
      <div className="flex items-center gap-2 mb-1">
        <label className="font-medium text-sm">{label}</label>
        {tooltips[param] && (
            <div className="relative group">
                <Info size={14} className="text-slate-400 cursor-help" />
                <div className="absolute left-full bottom-0 ml-2 mb-1 w-60 p-2 bg-slate-700 rounded-lg text-xs shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 border border-slate-600">
                    {tooltips[param]}
                </div>
            </div>
         )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 pl-2">
          <input
            type="checkbox"
            id={`${param}-right`}
            checked={measurements[param]?.right ?? false}
            onChange={(e) => handleInputChange(param, 'right', e.target.checked)}
            className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700"
           />
           <label htmlFor={`${param}-right`} className="text-xs">Right</label>
        </div>
         <div className="flex items-center space-x-2 pl-2">
          <input
            type="checkbox"
            id={`${param}-left`}
            checked={measurements[param]?.left ?? false}
            onChange={(e) => handleInputChange(param, 'left', e.target.checked)}
            className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700"
           />
            <label htmlFor={`${param}-left`} className="text-xs">Left</label>
        </div>
      </div>
    </div>
   );

   const renderBeightonTrunkCheckbox = (param, label) => (
       <div key={param} className="mb-1">
        <div className="flex items-center gap-2 mb-1">
            <label className="font-medium text-sm">{label}</label>
             {tooltips[param] && (
                <div className="relative group">
                    <Info size={14} className="text-slate-400 cursor-help" />
                    <div className="absolute left-full bottom-0 ml-2 mb-1 w-60 p-2 bg-slate-700 rounded-lg text-xs shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 border border-slate-600">
                        {tooltips[param]}
                    </div>
                </div>
             )}
        </div>
         <div className="flex items-center space-x-2 p-2">
           <input
            type="checkbox"
            id={param}
            checked={measurements[param]?.value ?? false}
            onChange={(e) => handleInputChange(param, null, e.target.checked)}
            className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700"
           />
            <label htmlFor={param} className="text-xs">Achieved</label>
        </div>
    </div>
   );


  // --- JSX Structure ---
  // Structure remains similar, just add/replace inputs
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
              {renderCheckboxInput('ctPerformed', 'CT Performed')} {/* Added CT */}
            </section>

            {/* Torsion & Length */}
            <section className="p-5 bg-slate-800/60 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Torsion & Length</h2>
              {renderNumericInput('femoralTorsion', 'Femoral Torsion', '°')}
              {renderNumericInput('tibialTorsion', 'Tibial Torsion', '°')}
              {renderNumericInput('legLength', 'Leg Length', 'mm')}
              {renderSingleValueNumericInput('legLengthDifference', 'Leg Length Diff (R-L)', 'mm', legLengthDifference)}
            </section>

             {/* Other Measurements */}
             <section className="p-5 bg-slate-800/60 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Other Measurements</h2>
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

            {/* Patellar Alignment */}
            <section className="p-5 bg-slate-800/60 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Patellar Alignment</h2>
               {renderNumericInput('tttgDistanceCT', 'TT-TG Distance (CT)', 'mm')}
               {renderNumericInput('tttgDistanceMRI', 'TT-TG Distance (MRI)', 'mm')}
               {renderNumericInput('tttgIndex', 'TT-TG Index', '')}
               {renderNumericInput('ttpclDistance', 'TT-PCL Distance', 'mm')}
               {renderNumericInput('patellaTilt', 'Patella Tilt', '°')}
            </section>

            {/* Beighton Score */}
            <section className="p-5 bg-slate-800/60 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Beighton Hypermobility Score</h2>
              {renderBeightonCheckbox('beightonPinky', 'Pinky >90°')}
              {renderBeightonCheckbox('beightonThumb', 'Thumb to Forearm')}
              {renderBeightonCheckbox('beightonElbow', 'Elbow Hyperext. >10°')}
              {renderBeightonCheckbox('beightonKnee', 'Knee Hyperext. >10°')}
              {renderBeightonTrunkCheckbox('beightonTrunk', 'Palms to Floor')}
               <div className="mt-4">
                 {renderSingleValueNumericInput('beightonTotalScore', 'Total Beighton Score', '/9', beightonTotalScore)}
               </div>

            </section>
          </div>
        </div>

         {/* Live Summary Table - Enabled */}
         <div className="p-6 border-t border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Live Summary Table</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-700 max-h-96"> {/* Added max-h for scroll */}
               <table className="w-full text-sm">
                  <thead className="bg-slate-700/50 sticky top-0"> {/* Sticky header */}
                     <tr>
                        <th className="text-left p-3 font-semibold whitespace-nowrap">Parameter</th>
                        <th className="text-center p-3 font-semibold whitespace-nowrap">Rechts</th>
                        <th className="text-center p-3 font-semibold whitespace-nowrap">Links</th>
                        <th className="text-center p-3 font-semibold whitespace-nowrap">Referenzbereich</th>
                     </tr>
                  </thead>
                  <tbody className="bg-slate-800/50">
                     {/* Display all parameters in the live table */}
                     {[
                         { key: 'mri', label: 'MRI Performed', type: 'bool' },
                         { key: 'xrayEOS', label: 'X-Ray/EOS Performed', type: 'bool' },
                         { key: 'ctPerformed', label: 'CT Performed', type: 'bool' },
                         { key: 'femoralTorsion', label: 'Femoral Torsion (°)', unit: '°', type: 'num' },
                         { key: 'tibialTorsion', label: 'Tibial Torsion (°)', unit: '°', type: 'num' },
                         { key: 'legLength', label: 'Leg Length (mm)', unit: 'mm', type: 'num' },
                         { key: 'legLengthDifference', label: 'Leg Length Diff (R-L)', unit: 'mm', type: 'calc', value: legLengthDifference },
                         { key: 'patellaHeightInsallSalvati', label: 'Patella Height (Insall-Salvati)', unit: '', type: 'num' },
                         { key: 'catonDeschampsIndex', label: 'Patella Height (Caton-Deschamps)', unit: '', type: 'num' },
                         { key: 'patellaTrochleaIndex', label: 'Patella-Trochlea Index (%)', unit: '%', type: 'num' },
                         { key: 'tttgDistanceCT', label: 'TT-TG Distance (CT)', unit: 'mm', type: 'num' },
                         { key: 'tttgDistanceMRI', label: 'TT-TG Distance (MRI)', unit: 'mm', type: 'num' },
                         { key: 'tttgIndex', label: 'TT-TG Index', unit: '', type: 'num' },
                         { key: 'ttpclDistance', label: 'TT-PCL Distance', unit: 'mm', type: 'num' },
                         { key: 'patellaTilt', label: 'Patella Tilt (°)', unit: '°', type: 'num' },
                         { key: 'genuValgum', label: 'Genu Valgum (°)', unit: '°', type: 'num' },
                         { key: 'beightonTotalScore', label: 'Beighton Score', unit: '/9', type: 'calc', value: beightonTotalScore },
                     ].map(({ key, label, unit, type, value }) => {
                        const rightVal = measurements[key]?.right ?? measurements[key]?.value ?? value;
                        const leftVal = measurements[key]?.left ?? measurements[key]?.value ?? value; // Fallback to calculated value if available
                        const ref = rangeLabels[key] || '-';
                        let rightDisplay = '-';
                        let leftDisplay = '-';

                         if (key === 'legLengthDifference' || key === 'beightonTotalScore') {
                            rightDisplay = value !== '' ? `${value}${unit || ''}` : '-';
                            leftDisplay = ''; // Single calculated value
                         } else if (type === 'bool') {
                             rightDisplay = rightVal ? 'Ja' : 'Nein';
                             leftDisplay = ''; // Single value boolean
                         } else { // type 'num' or other R/L
                            rightDisplay = (rightVal !== '' && rightVal !== null && rightVal !== undefined) ? `${rightVal}${unit || ''}` : '-';
                            leftDisplay = (leftVal !== '' && leftVal !== null && leftVal !== undefined) ? `${leftVal}${unit || ''}` : '-';
                         }

                        // Special formatting for leg length
                        if (key === 'legLength') {
                           rightDisplay = measurements.legLength.right || '-';
                           leftDisplay = measurements.legLength.left || '-';
                        }

                        return (
                           <tr key={key} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/30">
                              <td className="p-3 font-medium whitespace-nowrap">{label}</td>
                              <td className={`text-center p-3 whitespace-nowrap ${getRangeStatus(rightVal, key) !== 'neutral' && type !== 'bool' ? getStatusColor(getRangeStatus(rightVal, key)) : ''}`}>{rightDisplay}</td>
                              <td className={`text-center p-3 whitespace-nowrap ${getRangeStatus(leftVal, key) !== 'neutral' && type !== 'bool' ? getStatusColor(getRangeStatus(leftVal, key)) : ''}`}>{leftDisplay}</td>
                              <td className="text-center p-3 text-slate-400 whitespace-nowrap">{ref}</td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>

      </div>
    </div>
  );
};

export default KneeMeasurementInterface;
