import React, { useState, useEffect } from 'react';
import { Info, Clipboard, Check } from 'lucide-react';

const KneeMeasurementInterface = () => {
  // --- STATE ---
  const [copied, setCopied] = useState(false);
  // MODIFIED State for Imaging R/L
  const [measurements, setMeasurements] = useState({
    mri: { right: false, left: false },         // Changed
    xrayEOS: { right: false, left: false },   // Changed
    ctPerformed: { right: false, left: false }, // Changed
    femoralTorsion: { right: '', left: '' },
    tibialTorsion: { right: '', left: '' },
    legLength: { right: '', left: '' },
    patellaHeightInsallSalvati: { right: '', left: '' },
    catonDeschampsIndex: { right: '', left: '' },
    patellaTrochleaIndex: { right: '', left: '' },
    tttgDistanceCT: { right: '', left: '' },
    tttgDistanceMRI: { right: '', left: '' },
    tttgIndex: { right: '', left: '' },
    ttpclDistance: { right: '', left: '' },
    patellaTilt: { right: '', left: '' },
    genuValgum: { right: '', left: '' },
    beightonPinky: { right: false, left: false },
    beightonThumb: { right: false, left: false },
    beightonElbow: { right: false, left: false },
    beightonKnee: { right: false, left: false },
    beightonTrunk: { value: false },
  });
  const [legLengthDifference, setLegLengthDifference] = useState('');
  const [beightonTotalScore, setBeightonTotalScore] = useState(0);

  // --- DATA (Tooltips, Ranges, Labels - Copied from your working version, check if updates needed) ---
   const tooltips = { /* ... full tooltips definition ... */
    mri: "MRI: Check if Magnetic Resonance Imaging was performed for Right and/or Left knee. Used for soft tissue detail (cartilage, ligaments like MPFL) and specific indices (e.g., Patella-Trochlea Index).",
    xrayEOS: "X-Ray/EOS: Check if Radiography or EOS was performed for Right and/or Left knee. Used for bone morphology, overall alignment (valgus/varus), and height indices (Caton-Deschamps, Insall-Salvati).",
    ctPerformed: "CT: Check if Computed Tomography was performed for Right and/or Left knee. Often used for precise bone measurements like Torsion and TT-TG distance.",
    femoralTorsion: "Femoral Torsion (°): Axial rotation (twist) of the femur, measured via CT or MRI. Normal range varies by method (e.g., Waidelich: ~10-25°). Values >25-30° indicate excessive anteversion, a risk factor for instability.",
    tibialTorsion: "Tibial Torsion (°): Axial rotation (twist) of the tibia, measured via CT or MRI. Excessive external torsion (>40°) can increase lateral pull on the patella.",
    legLength: "Leg Length (mm): Absolute length measured (e.g., on EOS). Difference between sides is often clinically relevant.",
    legLengthDifference: "Calculated difference between Right and Left leg lengths (Right - Left). A significant difference can affect biomechanics.",
    patellaHeightInsallSalvati: "Insall-Salvati Index: Patellar Tendon Length / Patella Length (Lateral X-Ray). Normal: 0.8-1.2. Values >1.2 indicate Patella Alta (high-riding).",
    catonDeschampsIndex: "Caton-Deschamps Index: Distance (Lower Patellar Pole to Tibial Plateau) / Patellar Articular Length (Lateral X-Ray). Normal: 0.6-1.2. Values >1.3 strongly suggest Patella Alta.",
    patellaTrochleaIndex: "Patella-Trochlea Index (PTI - Biedert %): Cartilage overlap between patella and trochlea (Sagittal MRI). Normal: ≥12.5%. Less overlap (<12.5%) indicates poor engagement and instability risk.",
    tttgDistanceCT: "TT-TG Distance (CT) (mm): Lateral offset of Tibial Tubercle relative to Trochlear Groove (Axial CT). Normal: ≤20mm. Measures extensor mechanism alignment.",
    tttgDistanceMRI: "TT-TG Distance (MRI) (mm): Lateral offset using cartilage landmarks (Axial MRI). Normal: <~15mm (use age-specific norms if available). Values >15-20mm are generally pathological.",
    tttgIndex: "TT-TG Index: Ratio TT-TG / TT-TE (distance to Trochlear Entrance), normalizes for knee size. Normal: <0.23. Higher values indicate relative lateralization.",
    ttpclDistance: "TT-PCL Distance (mm): Lateral distance from Tibial Tubercle to medial border of PCL (Axial CT/MRI). Normal: <24mm. Helps isolate tibial contribution to TT-TG.",
    patellaTilt: "Patella Tilt (°): Angle of patella relative to posterior condyles (Axial CT/MRI, often near extension). Normal: ≤20°. Excessive tilt (>20°) indicates lateral tightness or maltracking.",
    genuValgum: "Genu Valgum (°): Overall knee valgus angle (Frontal Plane, Standing X-Ray/EOS). Normal: ~5-7°. Excessive valgus increases lateral forces on the patella.",
    beightonTotalScore: "Beighton Score (0-9): Assesses generalized joint hypermobility. Score ≥5 (adults) or ≥6 (children) suggests hypermobility.",
    beightonPinky: "Beighton - Pinky: Passive dorsiflexion >90° (1pt/side).", beightonThumb: "Beighton - Thumb: Passive apposition to forearm (1pt/side).", beightonElbow: "Beighton - Elbow: Hyperextension >10° (1pt/side).", beightonKnee: "Beighton - Knee: Hyperextension >10° (1pt/side).", beightonTrunk: "Beighton - Trunk: Palms flat on floor, knees straight (1pt)."
    };
   const normalRanges = { /* ... full normalRanges definition ... */
        femoralTorsion: { low: 5, high: 25 }, tibialTorsion: { low: 10, high: 40 }, patellaHeightInsallSalvati: { low: 0.8, high: 1.2 }, catonDeschampsIndex: { low: 0.6, high: 1.2 }, patellaTrochleaIndex: { low: 12.5, high: 100 }, tttgDistanceCT: { low: 0, high: 20 }, tttgDistanceMRI: { low: 0, high: 15 }, tttgIndex: { low: 0, high: 0.23 }, ttpclDistance: { low: 0, high: 24 }, patellaTilt: { low: -5, high: 20 }, genuValgum: { low: 0, high: 7 }, beightonTotalScore: { low: 0, high: 4 }
    };
  const rangeLabels = { /* ... full rangeLabels definition ... */
        mri: "Yes/No", xrayEOS: "Yes/No", ctPerformed: "Yes/No", // Reference for R/L display
        femoralTorsion: "~10-25° (Path >25-30°)", tibialTorsion: "Varies (Path >40°)", legLength: "N/A", legLengthDifference: "N/A", patellaHeightInsallSalvati: "0.8-1.2", catonDeschampsIndex: "0.6-1.2 (Alta >1.3)", patellaTrochleaIndex: "≥12.5%", tttgDistanceCT: "≤20 mm", tttgDistanceMRI: "<15 mm (use age norms)", tttgIndex: "<0.23", ttpclDistance: "<24 mm", patellaTilt: "≤20°", genuValgum: "<7° (approx)", beightonTotalScore: "Score /9 (Hyper ≥5)"
    };

  // --- CALCULATIONS (Copied from working version) ---
  useEffect(() => { /* ... leg length diff ... */
      const rightLen = parseFloat(measurements.legLength.right); const leftLen = parseFloat(measurements.legLength.left);
      if (!isNaN(rightLen) && !isNaN(leftLen)) setLegLengthDifference((rightLen - leftLen).toFixed(1)); else setLegLengthDifference('');
   }, [measurements.legLength.right, measurements.legLength.left]);
  useEffect(() => { /* ... Beighton score ... */
      let score = 0; if (measurements.beightonPinky.right) score++; if (measurements.beightonPinky.left) score++; if (measurements.beightonThumb.right) score++; if (measurements.beightonThumb.left) score++; if (measurements.beightonElbow.right) score++; if (measurements.beightonElbow.left) score++; if (measurements.beightonKnee.right) score++; if (measurements.beightonKnee.left) score++; if (measurements.beightonTrunk.value) score++;
      setBeightonTotalScore(score);
   }, [measurements.beightonPinky, measurements.beightonThumb, measurements.beightonElbow, measurements.beightonKnee, measurements.beightonTrunk]);

  // --- INPUT HANDLING (MODIFIED only for imaging keys) ---
  const handleInputChange = (param, side, value) => {
    if (param === 'beightonTrunk') {
      setMeasurements(prev => ({ ...prev, beightonTrunk: { value: value } }));
    // MODIFIED: Check if param is one of the imaging keys needing R/L object update
    } else if (['mri', 'xrayEOS', 'ctPerformed', 'beightonPinky', 'beightonThumb', 'beightonElbow', 'beightonKnee'].includes(param)) {
      setMeasurements(prev => ({
        ...prev,
        [param]: {
          ...prev[param], // Keep the other side's value
          [side]: value   // Update the specific side (right or left)
        }
      }));
    } else {
      // Original logic for numeric R/L inputs
      setMeasurements(prev => ({
        ...prev,
        [param]: {
          ...prev[param],
          [side]: value
        }
      }));
    }
  };

  // --- STATUS & COLOR LOGIC (Copied from working version) ---
   const getRangeStatus = (value, type) => { /* ... */
        if (value === '' || value === null || !normalRanges[type]) return 'neutral'; const num = parseFloat(value); if (isNaN(num)) return 'neutral'; const range = normalRanges[type];
        if (type === 'patellaTrochleaIndex') return num >= range.low ? 'normal' : 'low'; if (type === 'beightonTotalScore') return num <= range.high ? 'normal' : 'high';
        if (num < range.low) return 'low'; if (num > range.high) return 'high'; return 'normal';
    };
  const getStatusColor = (status) => { /* ... */
        const colors = { low: 'border-amber-500/60 text-amber-400', high: 'border-rose-500/60 text-rose-400', normal: 'border-emerald-500/60 text-emerald-400', neutral: 'border-slate-600' };
        return colors[status] || colors.neutral;
   };

  // --- CLIPBOARD FUNCTIONALITY (MODIFIED for imaging keys) ---
  const copyToClipboard = () => {
     const allParameters = [
        // Specify 'bool_lr' for imaging
        { key: 'mri', label: 'MRI Performed', type: 'bool_lr' },
        { key: 'xrayEOS', label: 'X-Ray/EOS Performed', type: 'bool_lr' },
        { key: 'ctPerformed', label: 'CT Performed', type: 'bool_lr' },
        { key: 'femoralTorsion', label: 'Femoral Torsion (°)', unit: '°', type: 'num_lr' },
        { key: 'tibialTorsion', label: 'Tibial Torsion (°)', unit: '°', type: 'num_lr' },
        { key: 'legLength', label: 'Leg Length (mm)', unit: 'mm', type: 'num_lr' },
        { key: 'legLengthDifference', label: 'Leg Length Diff (R-L)', unit: 'mm', type: 'calc_single', value: legLengthDifference },
        { key: 'patellaHeightInsallSalvati', label: 'Patella Height (Insall-Salvati)', unit: '', type: 'num_lr' },
        { key: 'catonDeschampsIndex', label: 'Patella Height (Caton-Deschamps)', unit: '', type: 'num_lr' },
        { key: 'patellaTrochleaIndex', label: 'Patella-Trochlea Index (%)', unit: '%', type: 'num_lr' },
        { key: 'tttgDistanceCT', label: 'TT-TG Distance (CT)', unit: 'mm', type: 'num_lr' },
        { key: 'tttgDistanceMRI', label: 'TT-TG Distance (MRI)', unit: 'mm', type: 'num_lr' },
        { key: 'tttgIndex', label: 'TT-TG Index', unit: '', type: 'num_lr' },
        { key: 'ttpclDistance', label: 'TT-PCL Distance', unit: 'mm', type: 'num_lr' },
        { key: 'patellaTilt', label: 'Patella Tilt (°)', unit: '°', type: 'num_lr' },
        { key: 'genuValgum', label: 'Genu Valgum (°)', unit: '°', type: 'num_lr' },
        { key: 'beightonTotalScore', label: 'Beighton Score', unit: '/9', type: 'calc_single', value: beightonTotalScore },
    ];
    // MODIFIED filter for bool_lr
    const includedParameters = allParameters.filter(p => {
      if (p.type === 'bool_lr') return measurements[p.key]?.right === true || measurements[p.key]?.left === true; // Include if R or L is true
      if (p.type === 'num_lr') return measurements[p.key]?.right !== '' || measurements[p.key]?.left !== '';
      if (p.type === 'calc_single') return p.value !== '' && parseFloat(p.value) !== 0;
      return false;
    });
     if (includedParameters.length === 0) { alert("No data entered to copy."); return; }
    const rows = [['Parameter', 'Rechts', 'Links', 'Referenzbereich']];
    includedParameters.forEach(({ key, label, unit, type, value }) => {
        const rightVal = measurements[key]?.right;
        const leftVal = measurements[key]?.left;
        const ref = rangeLabels[key] || '-';
        let rightDisplay = '-'; let leftDisplay = '-';
        // MODIFIED display logic for bool_lr
        if (type === 'bool_lr') {
            rightDisplay = rightVal ? 'Ja' : 'Nein';
            leftDisplay = leftVal ? 'Ja' : 'Nein';
        } else if (type === 'calc_single') {
            rightDisplay = value !== '' ? `${value}${unit || ''}` : '-'; leftDisplay = '';
        } else { /* num_lr */
            rightDisplay = (rightVal !== '' && rightVal !== undefined && rightVal !== null) ? `${rightVal}${unit || ''}` : '-';
            leftDisplay = (leftVal !== '' && leftVal !== undefined && leftVal !== null) ? `${leftVal}${unit || ''}` : '-';
        }
        rows.push([label, rightDisplay, leftDisplay, ref]);
    });
    // HTML & Text Table Generation & Clipboard API Call (Same as before)
    let htmlTable = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; font-family: sans-serif; border: 1px solid #ddd;"><thead><tr>'; rows[0].forEach(header => { htmlTable += `<th style="background-color: #f2f2f2; font-weight: bold; padding: 8px; border: 1px solid #ddd; text-align: left;">${header}</th>`; }); htmlTable += '</tr></thead><tbody>'; for (let i = 1; i < rows.length; i++) { htmlTable += '<tr>'; rows[i].forEach((cell, index) => { const style = index === 0 ? 'font-weight: bold; padding: 8px; border: 1px solid #ddd;' : 'padding: 8px; border: 1px solid #ddd;'; const textAlign = index > 0 ? ' text-align: center;' : ''; htmlTable += `<td style="${style}${textAlign}">${cell}</td>`; }); htmlTable += '</tr>'; } htmlTable += '</tbody></table>'; let plainText = ''; rows.forEach(row => { plainText += row.map(cell => `"${(cell ?? '').toString().replace(/"/g, '""')}"`).join('\t') + '\n'; });
    try { const blobHtml = new Blob([htmlTable], { type: 'text/html' }); const blobText = new Blob([plainText], { type: 'text/plain' }); const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })]; navigator.clipboard.write(data).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(err => { fallbackCopyTextToClipboard(plainText); }); } catch (err) { fallbackCopyTextToClipboard(plainText); }
   };
  const fallbackCopyTextToClipboard = (text) => { /* ... same fallback ... */ const textArea = document.createElement('textarea'); textArea.value = text; textArea.style.position = 'fixed'; document.body.appendChild(textArea); textArea.focus(); textArea.select(); try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error('Fallback: Oops, unable to copy', err); } document.body.removeChild(textArea); };


  // --- RENDER HELPER FUNCTIONS (Copied from previous working versions) ---

  // Helper for R/L Checkboxes (NEW)
  const renderCheckboxLRInput = (param, label) => (
     <>
      <div key={param} className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <label className="font-medium">{label}</label>
          {tooltips[param] && ( <div className="relative group"> <Info size={16} className="text-slate-400 cursor-help" /> <div className="tooltip-content">{tooltips[param]}</div> </div> )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 p-2 rounded-md border border-slate-700 bg-slate-800/30">
            <input type="checkbox" id={`${param}-right`} checked={measurements[param]?.right ?? false} onChange={(e) => handleInputChange(param, 'right', e.target.checked)} className="checkbox-style" />
            <label htmlFor={`${param}-right`} className="text-sm text-slate-300">Right</label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md border border-slate-700 bg-slate-800/30">
            <input type="checkbox" id={`${param}-left`} checked={measurements[param]?.left ?? false} onChange={(e) => handleInputChange(param, 'left', e.target.checked)} className="checkbox-style" />
            <label htmlFor={`${param}-left`} className="text-sm text-slate-300">Left</label>
          </div>
        </div>
      </div>
      <style jsx>{` /* ... checkbox + tooltip styles ... */ .checkbox-style { height: 1.25rem; width: 1.25rem; border-radius: 0.25rem; color: #2563eb; background-color: #475569; border-color: #64748b; } .checkbox-style:focus { box-shadow: 0 0 0 2px #3b82f6; } .tooltip-content { position: absolute; left: 100%; bottom: 50%; transform: translateY(50%); margin-left: 10px; width: max-content; max-width: 300px; padding: 8px 12px; background-color: #1e293b; color: #cbd5e1; border-radius: 6px; font-size: 0.8rem; box-shadow: 0 2px 5px rgba(0,0,0,0.2); opacity: 0; visibility: hidden; transition: opacity 0.2s ease, visibility 0.2s ease; z-index: 20; border: 1px solid #334155; pointer-events: none; } .group:hover .tooltip-content { opacity: 1; visibility: visible; } `}</style>
    </>
  );

  // Helper for R/L Numeric Inputs
  const renderNumericInputLR = (param, label, unit, disabled = false) => (
    <>
      <div key={param} className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <label className={`font-medium ${disabled ? 'text-slate-500' : ''}`}>{label}</label>
          {tooltips[param] && ( <div className="relative group"> <Info size={16} className="text-slate-400 cursor-help" /> <div className="tooltip-content">{tooltips[param]}</div> </div> )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`flex items-center space-x-2 p-2 rounded-md border ${getStatusColor(getRangeStatus(measurements[param]?.right, param))}`}>
            <label htmlFor={`${param}-right`} className="w-10 md:w-12 text-right text-sm shrink-0">Right:</label>
            <input id={`${param}-right`} type="number" step="any" value={measurements[param]?.right ?? ''} onChange={(e) => !disabled && handleInputChange(param, 'right', e.target.value)} disabled={disabled} className={`input-style ${disabled ? 'input-disabled' : ''}`} placeholder={disabled ? '-' : '0'} />
            <span className="text-sm">{unit}</span>
          </div>
          <div className={`flex items-center space-x-2 p-2 rounded-md border ${getStatusColor(getRangeStatus(measurements[param]?.left, param))}`}>
           <label htmlFor={`${param}-left`} className="w-10 md:w-12 text-right text-sm shrink-0">Left:</label>
           <input id={`${param}-left`} type="number" step="any" value={measurements[param]?.left ?? ''} onChange={(e) => !disabled && handleInputChange(param, 'left', e.target.value)} disabled={disabled} className={`input-style ${disabled ? 'input-disabled' : ''}`} placeholder={disabled ? '-' : '0'} />
           <span className="text-sm">{unit}</span>
          </div>
        </div>
         {/* Only display ref label if it exists AND is not 'N/A' */}
         {rangeLabels[param] && rangeLabels[param] !== 'N/A' && <div className="text-right text-xs text-slate-400 mt-1 pr-2">Ref: {rangeLabels[param]}</div>}
      </div>
      <style jsx>{` /* ... input + tooltip styles ... */ .input-style { width: 100%; flex-grow: 1; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.25rem; padding-bottom: 0.25rem; background-color: #0f172a; border: 1px solid #475569; border-radius: 0.375rem; color: #e2e8f0; } .input-style:focus { outline: none; box-shadow: 0 0 0 2px #3b82f6; border-color: transparent; } .input-disabled { opacity: 0.5; cursor: not-allowed; } .tooltip-content { position: absolute; left: 100%; bottom: 50%; transform: translateY(50%); margin-left: 10px; width: max-content; max-width: 300px; padding: 8px 12px; background-color: #1e293b; color: #cbd5e1; border-radius: 6px; font-size: 0.8rem; box-shadow: 0 2px 5px rgba(0,0,0,0.2); opacity: 0; visibility: hidden; transition: opacity 0.2s ease, visibility 0.2s ease; z-index: 20; border: 1px solid #334155; pointer-events: none; } .group:hover .tooltip-content { opacity: 1; visibility: visible; } `}</style>
    </>
  );

  // Helper for Beighton R/L Checkboxes
  const renderBeightonCheckboxLR = (param, label) => (
    <>
      <div key={param} className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <label className="font-medium text-sm">{label}</label>
          {tooltips[param] && ( <div className="relative group"> <Info size={14} className="text-slate-400 cursor-help" /> <div className="tooltip-content">{tooltips[param]}</div> </div> )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center space-x-2 pl-2">
            <input id={`${param}-right`} type="checkbox" checked={measurements[param]?.right ?? false} onChange={(e) => handleInputChange(param, 'right', e.target.checked)} className="checkbox-style-small" />
            <label htmlFor={`${param}-right`} className="text-xs">Right</label>
          </div>
          <div className="flex items-center space-x-2 pl-2">
            <input id={`${param}-left`} type="checkbox" checked={measurements[param]?.left ?? false} onChange={(e) => handleInputChange(param, 'left', e.target.checked)} className="checkbox-style-small" />
            <label htmlFor={`${param}-left`} className="text-xs">Left</label>
          </div>
        </div>
      </div>
       <style jsx>{` /* ... small checkbox + tooltip styles ... */ .checkbox-style-small { height: 1rem; width: 1rem; border-radius: 0.25rem; color: #2563eb; background-color: #475569; border-color: #64748b; } .checkbox-style-small:focus { box-shadow: 0 0 0 2px #3b82f6; } .tooltip-content { position: absolute; left: 100%; bottom: 50%; transform: translateY(50%); margin-left: 10px; width: max-content; max-width: 240px; padding: 6px 10px; background-color: #1e293b; color: #cbd5e1; border-radius: 6px; font-size: 0.75rem; box-shadow: 0 2px 5px rgba(0,0,0,0.2); opacity: 0; visibility: hidden; transition: opacity 0.2s ease, visibility 0.2s ease; z-index: 20; border: 1px solid #334155; pointer-events: none; } .group:hover .tooltip-content { opacity: 1; visibility: visible; } `}</style>
    </>
   );

    // Helper for Beighton Trunk Checkbox
    const renderBeightonTrunkCheckbox = (param, label) => (
        <>
            <div key={param} className="mb-1">
                <div className="flex items-center gap-2 mb-1">
                    <label className="font-medium text-sm">{label}</label>
                    {tooltips[param] && ( <div className="relative group"> <Info size={14} className="text-slate-400 cursor-help" /> <div className="tooltip-content">{tooltips[param]}</div> </div> )}
                </div>
                <div className="flex items-center space-x-2 p-2">
                    <input id={param} type="checkbox" checked={measurements[param]?.value ?? false} onChange={(e) => handleInputChange(param, null, e.target.checked)} className="checkbox-style-small" />
                    <label htmlFor={param} className="text-xs">Achieved</label>
                </div>
            </div>
             <style jsx>{` /* ... small checkbox + tooltip styles ... */ .checkbox-style-small { height: 1rem; width: 1rem; border-radius: 0.25rem; color: #2563eb; background-color: #475569; border-color: #64748b; } .checkbox-style-small:focus { box-shadow: 0 0 0 2px #3b82f6; } .tooltip-content { position: absolute; left: 100%; bottom: 50%; transform: translateY(50%); margin-left: 10px; width: max-content; max-width: 240px; padding: 6px 10px; background-color: #1e293b; color: #cbd5e1; border-radius: 6px; font-size: 0.75rem; box-shadow: 0 2px 5px rgba(0,0,0,0.2); opacity: 0; visibility: hidden; transition: opacity 0.2s ease, visibility 0.2s ease; z-index: 20; border: 1px solid #334155; pointer-events: none; } .group:hover .tooltip-content { opacity: 1; visibility: visible; } `}</style>
        </>
    );

    // Helper for Single Value Display
    const renderSingleValueDisplay = (param, label, unit, value) => (
        <>
            <div key={param} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <label className="font-medium">{label}</label>
                    {tooltips[param] && ( <div className="relative group"> <Info size={16} className="text-slate-400 cursor-help" /> <div className="tooltip-content">{tooltips[param]}</div> </div> )}
                </div>
                <div className={`flex items-center space-x-2 p-2 rounded-md border ${getStatusColor(getRangeStatus(value, param))}`}>
                    <input type="text" value={(value !== '' && value !== null && !isNaN(parseFloat(value))) ? `${value}${unit || ''}` : '-'} readOnly className="input-display" placeholder="-" />
                </div>
                {rangeLabels[param] && rangeLabels[param] !== 'N/A' && <div className="text-right text-xs text-slate-400 mt-1 pr-2">Ref: {rangeLabels[param]}</div>}
            </div>
            <style jsx>{` /* ... input display + tooltip styles ... */ .input-display { width: 100%; flex-grow: 1; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.25rem; padding-bottom: 0.25rem; background-color: #0f172a66; border: 0; border-radius: 0.375rem; outline: none; text-align: center; color: #cbd5e1; font-weight: 500; } .tooltip-content { position: absolute; left: 100%; bottom: 50%; transform: translateY(50%); margin-left: 10px; width: max-content; max-width: 300px; padding: 8px 12px; background-color: #1e293b; color: #cbd5e1; border-radius: 6px; font-size: 0.8rem; box-shadow: 0 2px 5px rgba(0,0,0,0.2); opacity: 0; visibility: hidden; transition: opacity 0.2s ease, visibility 0.2s ease; z-index: 20; border: 1px solid #334155; pointer-events: none; } .group:hover .tooltip-content { opacity: 1; visibility: visible; } `}</style>
        </>
     );


  // --- summaryTableParameters defined BEFORE return ---
  const summaryTableParameters = [ /* ... same definition ... */
        { key: 'mri', label: 'MRI Performed', type: 'bool_lr' }, { key: 'xrayEOS', label: 'X-Ray/EOS Performed', type: 'bool_lr' }, { key: 'ctPerformed', label: 'CT Performed', type: 'bool_lr' }, { key: 'femoralTorsion', label: 'Femoral Torsion (°)', unit: '°', type: 'num_lr' }, { key: 'tibialTorsion', label: 'Tibial Torsion (°)', unit: '°', type: 'num_lr' }, { key: 'legLength', label: 'Leg Length (mm)', unit: 'mm', type: 'num_lr' }, { key: 'legLengthDifference', label: 'Leg Length Diff (R-L)', unit: 'mm', type: 'calc_single', value: legLengthDifference }, { key: 'patellaHeightInsallSalvati', label: 'Patella Height (Insall-Salvati)', unit: '', type: 'num_lr' }, { key: 'catonDeschampsIndex', label: 'Patella Height (Caton-Deschamps)', unit: '', type: 'num_lr' }, { key: 'patellaTrochleaIndex', label: 'Patella-Trochlea Index (%)', unit: '%', type: 'num_lr' }, { key: 'tttgDistanceCT', label: 'TT-TG Distance (CT)', unit: 'mm', type: 'num_lr' }, { key: 'tttgDistanceMRI', label: 'TT-TG Distance (MRI)', unit: 'mm', type: 'num_lr' }, { key: 'tttgIndex', label: 'TT-TG Index', unit: '', type: 'num_lr' }, { key: 'ttpclDistance', label: 'TT-PCL Distance', unit: 'mm', type: 'num_lr' }, { key: 'patellaTilt', label: 'Patella Tilt (°)', unit: '°', type: 'num_lr' }, { key: 'genuValgum', label: 'Genu Valgum (°)', unit: '°', type: 'num_lr' }, { key: 'beightonTotalScore', label: 'Beighton Score', unit: '/9', type: 'calc_single', value: beightonTotalScore },
   ];

  // --- FULL JSX STRUCTURE ---
  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-slate-800/70 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
         {/* Header */}
        <div className="p-4 md:p-6 bg-slate-900/70 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div className="flex-grow"> <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight">Knee Radiographic & Clinical Parameters</h1> <p className="text-xs md:text-sm text-slate-400 mt-1">Enter values below. Fields highlight based on typical ranges.</p> </div>
           <button onClick={copyToClipboard} className="button-style" disabled={copied}> {copied ? <Check size={18} className="animate-pulse" /> : <Clipboard size={18} />} {copied ? 'Copied!' : 'Copy Filtered Summary'} </button>
        </div>

        {/* Main Content Grid */}
        <div className="p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <section className="section-style">
              <h2 className="section-header">Imaging</h2>
              {/* Use R/L Checkbox Input */}
              {renderCheckboxLRInput('mri', 'MRI Performed')}
              {renderCheckboxLRInput('xrayEOS', 'X-Ray/EOS Performed')}
              {renderCheckboxLRInput('ctPerformed', 'CT Performed')}
            </section>
            {/* Torsion/Length/Alignment Sections use other helpers */}
            <section className="section-style"> <h2 className="section-header">Torsion & Length</h2> {renderNumericInputLR('femoralTorsion', 'Femoral Torsion', '°')} {renderNumericInputLR('tibialTorsion', 'Tibial Torsion', '°')} {renderNumericInputLR('legLength', 'Leg Length', 'mm')} {renderSingleValueDisplay('legLengthDifference', 'Leg Length Diff (R-L)', 'mm', legLengthDifference)} </section>
            <section className="section-style"> <h2 className="section-header">Alignment</h2> {renderNumericInputLR('genuValgum', 'Genu Valgum', '°')} </section>
          </div>
          {/* Right Column */}
          <div className="space-y-6">
             <section className="section-style"> <h2 className="section-header">Patella Height</h2> {renderNumericInputLR('patellaHeightInsallSalvati', 'Insall-Salvati Index', '')} {renderNumericInputLR('catonDeschampsIndex', 'Caton-Deschamps Index', '')} {renderNumericInputLR('patellaTrochleaIndex', 'Patella-Trochlea Index (PTI)', '%')} </section>
             <section className="section-style"> <h2 className="section-header">Patellar Alignment</h2> {renderNumericInputLR('tttgDistanceCT', 'TT-TG Distance (CT)', 'mm')} {renderNumericInputLR('tttgDistanceMRI', 'TT-TG Distance (MRI)', 'mm')} {renderNumericInputLR('tttgIndex', 'TT-TG Index', '')} {renderNumericInputLR('ttpclDistance', 'TT-PCL Distance', 'mm')} {renderNumericInputLR('patellaTilt', 'Patella Tilt', '°')} </section>
             <section className="section-style"> <h2 className="section-header">Beighton Hypermobility</h2> {renderBeightonCheckboxLR('beightonPinky', 'Pinky >90°')} {renderBeightonCheckboxLR('beightonThumb', 'Thumb to Forearm')} {renderBeightonCheckboxLR('beightonElbow', 'Elbow Hyperext. >10°')} {renderBeightonCheckboxLR('beightonKnee', 'Knee Hyperext. >10°')} <div className="mt-2">{renderBeightonTrunkCheckbox('beightonTrunk', 'Trunk Flexion (Palms Flat)')}</div> <div className="mt-4">{renderSingleValueDisplay('beightonTotalScore', 'Total Beighton Score', '/9', beightonTotalScore)}</div> </section>
          </div>
        </div>

        {/* Live Summary Table (Updated logic for imaging display) */}
         <div className="p-4 md:p-6 lg:p-8 border-t border-slate-700">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-slate-100">Live Summary Table</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-700 shadow-md">
               <table className="w-full text-sm min-w-[700px]">
                  <thead className="bg-slate-700/50 text-slate-300 uppercase tracking-wider sticky top-0 z-10">
                     <tr> <th className="table-header">Parameter</th> <th className="table-header text-center">Rechts</th> <th className="table-header text-center">Links</th> <th className="table-header text-center">Referenzbereich</th> </tr>
                  </thead>
                  <tbody className="bg-slate-800/50">
                     {summaryTableParameters.map(({ key, label, unit, type, value: calculatedValue }) => {
                         let rightValState, leftValState, singleValState;
                         if (type === 'bool_lr') { // Use bool_lr for imaging
                             rightValState = measurements[key]?.right; leftValState = measurements[key]?.left;
                         } else if (type === 'calc_single') { singleValState = calculatedValue;
                         } else { /* num_lr */ rightValState = measurements[key]?.right; leftValState = measurements[key]?.left; }
                         let rightDisplay = '-'; let leftDisplay = '-'; let valueForColoringRight = null; let valueForColoringLeft = null;
                         if (type === 'bool_lr') { // UPDATED display for R/L bools
                            rightDisplay = rightValState ? 'Ja' : 'Nein'; leftDisplay = leftValState ? 'Ja' : 'Nein';
                         } else if (type === 'calc_single') { rightDisplay = singleValState !== '' ? `${singleValState}${unit || ''}` : '-'; leftDisplay = ''; valueForColoringRight = singleValState;
                         } else { /* num_lr */ rightDisplay = (rightValState !== '' && rightValState !== undefined && rightValState !== null) ? `${rightValState}${unit || ''}` : '-'; leftDisplay = (leftValState !== '' && leftValState !== undefined && leftValState !== null) ? `${leftValState}${unit || ''}` : '-'; valueForColoringRight = rightValState; valueForColoringLeft = leftValState; }
                         return ( <tr key={key} className="table-row"> <td className="table-cell font-medium">{label}</td> <td className={`table-cell text-center ${type !== 'bool_lr' ? getStatusColor(getRangeStatus(valueForColoringRight, key)) : ''}`}> {rightDisplay} </td> <td className={`table-cell text-center ${type !== 'bool_lr' ? getStatusColor(getRangeStatus(valueForColoringLeft, key)) : ''}`}> {leftDisplay} </td> <td className="table-cell text-center text-slate-400">{rangeLabels[key] || '-'}</td> </tr> );
                     })}
                  </tbody>
               </table>
            </div>
         </div>

      </div>
      {/* Inline CSS (ensure includes styles for checkbox-style and checkbox-style-small) */}
       <style jsx global>{`
            /* Include ALL necessary styles from previous versions here */
            .section-style { padding: 1.25rem; background-color: rgba(30, 41, 59, 0.4); border-radius: 0.5rem; border: 1px solid rgba(51, 65, 85, 0.5); box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
            .section-header { font-size: 1.125rem; line-height: 1.75rem; font-weight: 600; margin-bottom: 1rem; border-bottom: 1px solid #475569; padding-bottom: 0.5rem; color: #f1f5f9; }
            @media (min-width: 768px) { .section-header { font-size: 1.25rem; line-height: 1.75rem; } }
            .button-style { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: #2563eb; color: white; border-radius: 0.375rem; transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06); font-weight: 500; }
            .button-style:hover { background-color: #1d4ed8; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); }
            .button-style:disabled { opacity: 0.5; cursor: not-allowed; }
            @media (min-width: 768px) { .button-style { padding: 0.5rem 1rem; } }
            .table-header { padding: 0.75rem; font-weight: 600; white-space: nowrap; text-align: left; }
            .table-row { border-bottom: 1px solid #334155; transition: background-color 0.15s ease-in-out; }
            .table-row:last-child { border-bottom: 0; }
            .table-row:hover { background-color: rgba(51, 65, 85, 0.3); }
            .table-cell { padding: 0.75rem; white-space: nowrap; vertical-align: middle; }
            .tooltip-content { position: absolute; left: 100%; bottom: 50%; transform: translateY(50%); margin-left: 10px; width: max-content; max-width: 300px; padding: 8px 12px; background-color: #1e293b; color: #cbd5e1; border-radius: 6px; font-size: 0.8rem; box-shadow: 0 2px 5px rgba(0,0,0,0.2); opacity: 0; visibility: hidden; transition: opacity 0.2s ease, visibility 0.2s ease; z-index: 20; border: 1px solid #334155; pointer-events: none; }
            .group:hover .tooltip-content { opacity: 1; visibility: visible; }
            input[type='number']::-webkit-outer-spin-button, input[type='number']::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
            input[type='number'] { -moz-appearance: textfield; }
            .input-style { width: 100%; flex-grow: 1; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.25rem; padding-bottom: 0.25rem; background-color: #0f172a; border: 1px solid #475569; border-radius: 0.375rem; color: #e2e8f0; }
            .input-style:focus { outline: none; box-shadow: 0 0 0 2px #3b82f6; border-color: transparent; }
            .input-disabled { opacity: 0.5; cursor: not-allowed; }
            .checkbox-style { height: 1.25rem; width: 1.25rem; border-radius: 0.25rem; color: #2563eb; background-color: #475569; border-color: #64748b; } /* Checkbox R/L Imaging */
            .checkbox-style:focus { box-shadow: 0 0 0 2px #3b82f6; }
            .checkbox-style-small { height: 1rem; width: 1rem; border-radius: 0.25rem; color: #2563eb; background-color: #475569; border-color: #64748b; } /* Checkbox Beighton */
            .checkbox-style-small:focus { box-shadow: 0 0 0 2px #3b82f6; }
            .input-display { width: 100%; flex-grow: 1; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.25rem; padding-bottom: 0.25rem; background-color: #0f172a66; border: 0; border-radius: 0.375rem; outline: none; text-align: center; color: #cbd5e1; font-weight: 500; }
         `}</style>
    </div>
  );
};

export default KneeMeasurementInterface;
