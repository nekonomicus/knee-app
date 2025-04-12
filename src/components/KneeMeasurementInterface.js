import React, { useState, useEffect } from 'react';
import { Info, Clipboard, Check } from 'lucide-react';

// Ensure correct import paths (assuming components are in the same directory)
import SingleCheckboxInput from './SingleCheckboxInput';
import NumericInputLR from './NumericInputLR';
import BeightonCheckboxLR from './BeightonCheckboxLR';
import SingleValueDisplay from './SingleValueDisplay'; // Corrected import name if it was different

const KneeMeasurementInterface = () => {
  const [copied, setCopied] = useState(false);
  // State remains the same as the previous corrected version
  const [measurements, setMeasurements] = useState({
    mri: false,
    xrayEOS: false,
    ctPerformed: false,
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

  // Tooltips, NormalRanges, RangeLabels remain the same
   const tooltips = {
    mri: "MRI: Check if Magnetic Resonance Imaging was performed. Used for soft tissue detail (cartilage, ligaments like MPFL) and specific indices (e.g., Patella-Trochlea Index).",
    xrayEOS: "X-Ray/EOS: Check if standard Radiography or EOS (low-dose, standing) was performed. Used for bone morphology, overall alignment (valgus/varus), and height indices (Caton-Deschamps, Insall-Salvati).",
    ctPerformed: "CT: Check if Computed Tomography was performed. Often used for precise bone measurements like Torsion and TT-TG distance.",
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
    beightonPinky: "Beighton - Pinky: Passive dorsiflexion >90° (1pt/side).",
    beightonThumb: "Beighton - Thumb: Passive apposition to forearm (1pt/side).",
    beightonElbow: "Beighton - Elbow: Hyperextension >10° (1pt/side).",
    beightonKnee: "Beighton - Knee: Hyperextension >10° (1pt/side).",
    beightonTrunk: "Beighton - Trunk: Palms flat on floor, knees straight (1pt)."
  };
   const normalRanges = {
    femoralTorsion: { low: 5, high: 25 },
    tibialTorsion: { low: 10, high: 40 },
    patellaHeightInsallSalvati: { low: 0.8, high: 1.2 },
    catonDeschampsIndex: { low: 0.6, high: 1.2 },
    patellaTrochleaIndex: { low: 12.5, high: 100 },
    tttgDistanceCT: { low: 0, high: 20 },
    tttgDistanceMRI: { low: 0, high: 15 },
    tttgIndex: { low: 0, high: 0.23 },
    ttpclDistance: { low: 0, high: 24 },
    patellaTilt: { low: -5, high: 20 },
    genuValgum: { low: 0, high: 7 },
    beightonTotalScore: { low: 0, high: 4 }
  };
  const rangeLabels = {
    femoralTorsion: "~10-25° (Path >25-30°)",
    tibialTorsion: "Varies (Path >40°)",
    legLength: "N/A",
    legLengthDifference: "N/A",
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

  // Calculations useEffects (Same as previous)
  useEffect(() => {
    const rightLen = parseFloat(measurements.legLength.right);
    const leftLen = parseFloat(measurements.legLength.left);
    if (!isNaN(rightLen) && !isNaN(leftLen)) {
      setLegLengthDifference((rightLen - leftLen).toFixed(1));
    } else {
      setLegLengthDifference('');
    }
  }, [measurements.legLength.right, measurements.legLength.left]);

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

  // Input Handling (Same as previous, confirmed correct logic for single bools)
  const handleInputChange = (param, side, value) => {
    if (param === 'beightonTrunk') {
      setMeasurements(prev => ({ ...prev, beightonTrunk: { value: value } }));
      return;
    }
    if (param === 'mri' || param === 'xrayEOS' || param === 'ctPerformed') {
      setMeasurements(prev => ({ ...prev, [param]: value }));
      return;
    }
    setMeasurements(prev => ({
      ...prev,
      [param]: {
        ...prev[param],
        [side]: value
      }
    }));
  };

  // Status & Color Logic (Same as previous)
   const getRangeStatus = (value, type) => {
    if (value === '' || value === null || !normalRanges[type]) return 'neutral';
    const num = parseFloat(value);
    if (isNaN(num)) return 'neutral';
    const range = normalRanges[type];
    if (type === 'patellaTrochleaIndex') {
        return num >= range.low ? 'normal' : 'low';
    }
    if (type === 'beightonTotalScore') {
        return num <= range.high ? 'normal' : 'high';
    }
    if (num < range.low) return 'low';
    if (num > range.high) return 'high';
    return 'normal';
  };
  const getStatusColor = (status) => {
    const colors = {
      low: 'border-amber-500/60 text-amber-400',
      high: 'border-rose-500/60 text-rose-400',
      normal: 'border-emerald-500/60 text-emerald-400',
      neutral: 'border-slate-600'
    };
    return colors[status] || colors.neutral;
  };

  // Copy to Clipboard (Same filtered logic as previous)
  const copyToClipboard = () => {
     const allParameters = [
        { key: 'mri', label: 'MRI Performed', type: 'bool' },
        { key: 'xrayEOS', label: 'X-Ray/EOS Performed', type: 'bool' },
        { key: 'ctPerformed', label: 'CT Performed', type: 'bool' },
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
    const includedParameters = allParameters.filter(p => {
      if (p.type === 'bool') return measurements[p.key] === true;
      if (p.type === 'num_lr') return measurements[p.key]?.right !== '' || measurements[p.key]?.left !== '';
      if (p.type === 'calc_single') return p.value !== '' && parseFloat(p.value) !== 0; // Include calc if non-empty/non-zero
      return false;
    });
     if (includedParameters.length === 0) {
        alert("No data entered to copy.");
        return;
    }
    const rows = [
      ['Parameter', 'Rechts', 'Links', 'Referenzbereich']
    ];
    includedParameters.forEach(({ key, label, unit, type, value }) => {
        const rightVal = measurements[key]?.right;
        const leftVal = measurements[key]?.left;
        const ref = rangeLabels[key] || '-';
        let rightDisplay = '-';
        let leftDisplay = '-';
        if (type === 'bool') {
            rightDisplay = measurements[key] ? 'Ja' : 'Nein'; // Use direct boolean state
            leftDisplay = '';
        } else if (type === 'calc_single') {
            rightDisplay = value !== '' ? `${value}${unit || ''}` : '-';
            leftDisplay = '';
        } else { // type 'num_lr'
            rightDisplay = (rightVal !== '' && rightVal !== undefined && rightVal !== null) ? `${rightVal}${unit || ''}` : '-';
            leftDisplay = (leftVal !== '' && leftVal !== undefined && leftVal !== null) ? `${leftVal}${unit || ''}` : '-';
        }
        rows.push([label, rightDisplay, leftDisplay, ref]);
    });
    // HTML & Text Table Generation
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
    // Clipboard API Call
    try {
        const blobHtml = new Blob([htmlTable], { type: 'text/html' });
        const blobText = new Blob([plainText], { type: 'text/plain' });
        const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];
        navigator.clipboard.write(data).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => { fallbackCopyTextToClipboard(plainText); });
    } catch (err) { fallbackCopyTextToClipboard(plainText); }
  };
  const fallbackCopyTextToClipboard = (text) => { /* ... same fallback ... */
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; document.body.appendChild(textArea);
    textArea.focus(); textArea.select();
    try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (err) { console.error('Fallback: Oops, unable to copy', err); }
    document.body.removeChild(textArea);
   };


  // --- Full Parameter List for Live Summary Table ---
   const summaryTableParameters = [
        { key: 'mri', label: 'MRI Performed', type: 'bool' },
        { key: 'xrayEOS', label: 'X-Ray/EOS Performed', type: 'bool' },
        { key: 'ctPerformed', label: 'CT Performed', type: 'bool' },
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

  // --- JSX Structure ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-slate-800/70 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">

        {/* Header */}
        <div className="p-4 md:p-6 bg-slate-900/70 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div className="flex-grow">
             <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight">Knee Radiographic & Clinical Parameters</h1>
             <p className="text-xs md:text-sm text-slate-400 mt-1">Enter values below. Fields highlight based on typical ranges.</p>
           </div>
           <button
            onClick={copyToClipboard}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 text-sm md:text-base font-medium"
            disabled={copied}
          >
            {copied ? <Check size={18} className="animate-pulse" /> : <Clipboard size={18} />}
            {copied ? 'Copied!' : 'Copy Filtered Summary'}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* Left Column */}
          <div className="space-y-6">
            {/* Imaging */}
            <section className="p-4 md:p-5 bg-slate-800/40 rounded-lg border border-slate-700/50 shadow-inner">
              <h2 className="text-lg md:text-xl font-semibold mb-4 border-b border-slate-600 pb-2 text-slate-100">Imaging</h2>
              <SingleCheckboxInput id="mri" label="MRI Performed" tooltip={tooltips.mri} checked={measurements.mri} onChange={(e) => handleInputChange('mri', null, e.target.checked)} />
              <SingleCheckboxInput id="xrayEOS" label="X-Ray/EOS Performed" tooltip={tooltips.xrayEOS} checked={measurements.xrayEOS} onChange={(e) => handleInputChange('xrayEOS', null, e.target.checked)} />
              <SingleCheckboxInput id="ctPerformed" label="CT Performed" tooltip={tooltips.ctPerformed} checked={measurements.ctPerformed} onChange={(e) => handleInputChange('ctPerformed', null, e.target.checked)} />
            </section>

            {/* Torsion & Length */}
            <section className="p-4 md:p-5 bg-slate-800/40 rounded-lg border border-slate-700/50 shadow-inner">
              <h2 className="text-lg md:text-xl font-semibold mb-4 border-b border-slate-600 pb-2 text-slate-100">Torsion & Length</h2>
              <NumericInputLR param="femoralTorsion" label="Femoral Torsion" unit="°" tooltip={tooltips.femoralTorsion} rangeLabel={rangeLabels.femoralTorsion} valueRight={measurements.femoralTorsion.right} valueLeft={measurements.femoralTorsion.left} onChange={handleInputChange} getStatusColor={getStatusColor} getRangeStatus={getRangeStatus} />
              <NumericInputLR param="tibialTorsion" label="Tibial Torsion" unit="°" tooltip={tooltips.tibialTorsion} rangeLabel={rangeLabels.tibialTorsion} valueRight={measurements.tibialTorsion.right} valueLeft={measurements.tibialTorsion.left} onChange={handleInputChange} getStatusColor={getStatusColor} getRangeStatus={getRangeStatus} />
              <NumericInputLR param="legLength" label="Leg Length" unit="mm" tooltip={tooltips.legLength} rangeLabel={rangeLabels.legLength} valueRight={measurements.legLength.right} valueLeft={measurements.legLength.left} onChange={handleInputChange} getStatusColor={() => 'border-slate-600'} getRangeStatus={() => 'neutral'} /* No specific range */ />
              <SingleValueDisplay param="legLengthDifference" label="Leg Length Diff (R-L)" unit="mm" tooltip={tooltips.legLengthDifference} value={legLengthDifference} />
            </section>

            {/* Alignment */}
             <section className="p-4 md:p-5 bg-slate-800/40 rounded-lg border border-slate-700/50 shadow-inner">
              <h2 className="text-lg md:text-xl font-semibold mb-4 border-b border-slate-600 pb-2 text-slate-100">Alignment</h2>
               <NumericInputLR param="genuValgum" label="Genu Valgum" unit="°" tooltip={tooltips.genuValgum} rangeLabel={rangeLabels.genuValgum} valueRight={measurements.genuValgum.right} valueLeft={measurements.genuValgum.left} onChange={handleInputChange} getStatusColor={getStatusColor} getRangeStatus={getRangeStatus} />
            </section>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
             {/* Patella Height */}
             <section className="p-4 md:p-5 bg-slate-800/40 rounded-lg border border-slate-700/50 shadow-inner">
               <h2 className="text-lg md:text-xl font-semibold mb-4 border-b border-slate-600 pb-2 text-slate-100">Patella Height</h2>
               <NumericInputLR param="patellaHeightInsallSalvati" label="Insall-Salvati Index" unit="" tooltip={tooltips.patellaHeightInsallSalvati} rangeLabel={rangeLabels.patellaHeightInsallSalvati} valueRight={measurements.patellaHeightInsallSalvati.right} valueLeft={measurements.patellaHeightInsallSalvati.left} onChange={handleInputChange} getStatusColor={getStatusColor} getRangeStatus={getRangeStatus} />
               <NumericInputLR param="catonDeschampsIndex" label="Caton-Deschamps Index" unit="" tooltip={tooltips.catonDeschampsIndex} rangeLabel={rangeLabels.catonDeschampsIndex} valueRight={measurements.catonDeschampsIndex.right} valueLeft={measurements.catonDeschampsIndex.left} onChange={handleInputChange} getStatusColor={getStatusColor} getRangeStatus={getRangeStatus} />
               <NumericInputLR param="patellaTrochleaIndex" label="Patella-Trochlea Index (PTI)" unit="%" tooltip={tooltips.patellaTrochleaIndex} rangeLabel={rangeLabels.patellaTrochleaIndex} valueRight={measurements.patellaTrochleaIndex.right} valueLeft={measurements.patellaTrochleaIndex.left} onChange={handleInputChange} getStatusColor={getStatusColor} getRangeStatus={getRangeStatus} />
             </section>

            {/* Patellar Alignment */}
            <section className="p-4 md:p-5 bg-slate-800/40 rounded-lg border border-slate-700/50 shadow-inner">
              <h2 className="text-lg md:text-xl font-semibold mb-4 border-b border-slate-600 pb-2 text-slate-100">Patellar Alignment</h2>
              <NumericInputLR param="tttgDistanceCT" label="TT-TG Distance (CT)" unit="mm" tooltip={tooltips.tttgDistanceCT} rangeLabel={rangeLabels.tttgDistanceCT} valueRight={measurements.tttgDistanceCT.right} valueLeft={measurements.tttgDistanceCT.left} onChange={handleInputChange} getStatusColor={getStatusColor} getRangeStatus={getRangeStatus} />
              <NumericInputLR param="tttgDistanceMRI" label="TT-TG Distance (MRI)" unit="mm" tooltip={tooltips.tttgDistanceMRI} rangeLabel={rangeLabels.tttgDistanceMRI} valueRight={measurements.tttgDistanceMRI.right} valueLeft={measurements.tttgDistanceMRI.left} onChange={handleInputChange} getStatusColor={getStatusColor} getRangeStatus={getRangeStatus} />
              <NumericInputLR param="tttgIndex" label="TT-TG Index" unit="" tooltip={tooltips.tttgIndex} rangeLabel={rangeLabels.tttgIndex} valueRight={measurements.tttgIndex.right} valueLeft={measurements.tttgIndex.left} onChange={handleInputChange} getStatusColor={getStatusColor} getRangeStatus={getRangeStatus} />
              <NumericInputLR param="ttpclDistance" label="TT-PCL Distance" unit="mm" tooltip={tooltips.ttpclDistance} rangeLabel={rangeLabels.ttpclDistance} valueRight={measurements.ttpclDistance.right} valueLeft={measurements.ttpclDistance.left} onChange={handleInputChange} getStatusColor={getStatusColor} getRangeStatus={getRangeStatus} />
              <NumericInputLR param="patellaTilt" label="Patella Tilt" unit="°" tooltip={tooltips.patellaTilt} rangeLabel={rangeLabels.patellaTilt} valueRight={measurements.patellaTilt.right} valueLeft={measurements.patellaTilt.left} onChange={handleInputChange} getStatusColor={getStatusColor} getRangeStatus={getRangeStatus} />
            </section>

             {/* Beighton Score */}
            <section className="p-4 md:p-5 bg-slate-800/40 rounded-lg border border-slate-700/50 shadow-inner">
              <h2 className="text-lg md:text-xl font-semibold mb-4 border-b border-slate-600 pb-2 text-slate-100">Beighton Hypermobility</h2>
               <BeightonCheckboxLR param="beightonPinky" label="Pinky >90°" tooltip={tooltips.beightonPinky} checkedRight={measurements.beightonPinky.right} checkedLeft={measurements.beightonPinky.left} onChange={handleInputChange} />
               <BeightonCheckboxLR param="beightonThumb" label="Thumb to Forearm" tooltip={tooltips.beightonThumb} checkedRight={measurements.beightonThumb.right} checkedLeft={measurements.beightonThumb.left} onChange={handleInputChange} />
               <BeightonCheckboxLR param="beightonElbow" label="Elbow Hyperext. >10°" tooltip={tooltips.beightonElbow} checkedRight={measurements.beightonElbow.right} checkedLeft={measurements.beightonElbow.left} onChange={handleInputChange} />
               <BeightonCheckboxLR param="beightonKnee" label="Knee Hyperext. >10°" tooltip={tooltips.beightonKnee} checkedRight={measurements.beightonKnee.right} checkedLeft={measurements.beightonKnee.left} onChange={handleInputChange} />
               <div className="mt-2"> <SingleCheckboxInput id="beightonTrunk" label="Trunk Flexion (Palms Flat)" tooltip={tooltips.beightonTrunk} checked={measurements.beightonTrunk.value} onChange={(e) => handleInputChange('beightonTrunk', null, e.target.checked)} /> </div>
               <div className="mt-4"> <SingleValueDisplay param="beightonTotalScore" label="Total Beighton Score" unit="/9" tooltip={tooltips.beightonTotalScore} rangeLabel={rangeLabels.beightonTotalScore} value={beightonTotalScore} getStatusColor={getStatusColor} getRangeStatus={getRangeStatus} /> </div>
            </section>

          </div>
        </div>

         {/* Live Summary Table - No fixed height, allows horizontal scroll */}
         <div className="p-4 md:p-6 lg:p-8 border-t border-slate-700">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-slate-100">Live Summary Table</h2>
            {/* Wrapper allows horizontal scroll on small screens */}
            <div className="overflow-x-auto rounded-lg border border-slate-700 shadow-md">
               <table className="w-full text-sm min-w-[700px]"> {/* Min-width helps table layout */}
                  <thead className="bg-slate-700/50 text-slate-300 uppercase tracking-wider">
                     <tr>
                        <th className="text-left p-3 font-semibold whitespace-nowrap">Parameter</th>
                        <th className="text-center p-3 font-semibold whitespace-nowrap">Rechts</th>
                        <th className="text-center p-3 font-semibold whitespace-nowrap">Links</th>
                        <th className="text-center p-3 font-semibold whitespace-nowrap">Referenzbereich</th>
                     </tr>
                  </thead>
                  <tbody className="bg-slate-800/50">
                     {summaryTableParameters.map(({ key, label, unit, type, value: calculatedValue }) => {
                        // Simplified logic for getting values for display
                        let rightValState = measurements[key]?.right;
                        let leftValState = measurements[key]?.left;
                        let singleValState = measurements[key]; // For bools and single value calc

                        let rightDisplay = '-';
                        let leftDisplay = '-';
                        let valueForColoringRight = null;
                        let valueForColoringLeft = null;

                        if (type === 'bool') {
                            rightDisplay = singleValState ? 'Ja' : 'Nein';
                            leftDisplay = '';
                        } else if (type === 'calc_single') {
                            rightDisplay = calculatedValue !== '' ? `${calculatedValue}${unit || ''}` : '-';
                            leftDisplay = '';
                            valueForColoringRight = calculatedValue; // Use calculated value for coloring
                        } else { // num_lr
                            rightDisplay = (rightValState !== '' && rightValState !== undefined && rightValState !== null) ? `${rightValState}${unit || ''}` : '-';
                            leftDisplay = (leftValState !== '' && leftValState !== undefined && leftValState !== null) ? `${leftValState}${unit || ''}` : '-';
                            valueForColoringRight = rightValState;
                            valueForColoringLeft = leftValState;
                        }

                         // Override display for Leg Length for clarity
                         if (key === 'legLength') {
                             rightDisplay = measurements.legLength.right || '-';
                             leftDisplay = measurements.legLength.left || '-';
                         }

                        return (
                           <tr key={key} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/30 transition-colors duration-150">
                              <td className="p-3 font-medium whitespace-nowrap text-slate-200">{label}</td>
                              <td className={`text-center p-3 whitespace-nowrap ${type !== 'bool' ? getStatusColor(getRangeStatus(valueForColoringRight, key)) : ''}`}>
                                {rightDisplay}
                              </td>
                              <td className={`text-center p-3 whitespace-nowrap ${type === 'num_lr' ? getStatusColor(getRangeStatus(valueForColoringLeft, key)) : ''}`}>
                                {leftDisplay}
                              </td>
                              <td className="text-center p-3 text-slate-400 whitespace-nowrap">{rangeLabels[key] || '-'}</td>
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
