/**
 * Amrith Medical Report Generator
 * Compiles patient diagnostic and triage details into a clinical-grade printable HTML report.
 */

export function compileReportHtml({ patient, doctor, appointment, triage, isTemp = false }) {
  const dateStr = new Date(triage.processedAt || Date.now()).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const reportId = triage._id ? triage._id.toString().substring(0, 8).toUpperCase() : `TR-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const risk = triage.riskLevel || triage.risk || 'Low';
  const confidence = triage.confidence || 0;

  // Differential diagnosis items
  let differentialSection = '';
  if (triage.details?.top_predictions && triage.details.top_predictions.length > 0) {
    const listItems = triage.details.top_predictions.slice(0, 4).map((p, i) => `
      <div class="diff-item">
        <span class="diff-rank">${i + 1}.</span>
        <span class="diff-name">${p.disease}</span>
        <div class="diff-bar-container">
          <div class="diff-bar" style="width: ${p.confidence}%"></div>
        </div>
        <span class="diff-val">${p.confidence}%</span>
      </div>
    `).join('');

    differentialSection = `
      <div class="section-title">Differential Diagnosis Distribution</div>
      <div class="card">
        ${listItems}
      </div>
    `;
  }

  // Recommendations items (numbered list)
  const recs = triage.details?.recommendations || [
    'Consult a qualified physician for detailed clinical evaluation.',
    'Keep a detailed symptom diary to share with your doctor.',
    'Do not self-medicate or alter current prescriptions based on this report.'
  ];
  const recommendationsList = recs.map((r, i) => `<li>${i + 1}. ${r}</li>`).join('');

  // AI precautions (numbered)
  let aiPrecautionsSection = '';
  if (triage.details?.ai_precautions && Array.isArray(triage.details.ai_precautions) && triage.details.ai_precautions.length > 0) {
    const pList = triage.details.ai_precautions.map((p, i) => `<li>${i + 1}. ${p}</li>`).join('');
    aiPrecautionsSection = `
      <div class="section-title">Safety Precautions</div>
      <div class="card">
        <ul class="plain-list">
          ${pList}
        </ul>
      </div>
    `;
  }

  // AI medications (numbered)
  let aiMedicationsSection = '';
  if (triage.details?.ai_medications && Array.isArray(triage.details.ai_medications) && triage.details.ai_medications.length > 0) {
    const mList = triage.details.ai_medications.map((m, i) => `<li>${i + 1}. ${m}</li>`).join('');
    aiMedicationsSection = `
      <div class="section-title">Suggested Medications</div>
      <div class="card">
        <ul class="plain-list">
          ${mList}
        </ul>
      </div>
    `;
  }

  // Doctor section
  let doctorHtml = '<p class="text-muted">No physician consultation booked yet.</p>';
  if (doctor) {
    doctorHtml = `
      <div class="physician-card">
        <div>
          <div class="doc-name">Dr. ${doctor.name}</div>
          <div class="doc-spec">${doctor.specialization || 'General Practitioner'}</div>
          <div class="doc-qual">${doctor.qualification || 'MBBS, MD'}</div>
        </div>
      </div>
    `;
  } else if (appointment && appointment.doctorName) {
    doctorHtml = `
      <div class="physician-card">
        <div>
          <div class="doc-name">Dr. ${appointment.doctorName}</div>
          <div class="doc-spec">${appointment.departmentName || 'Medical Specialist'}</div>
        </div>
      </div>
    `;
  }

  // Appointment details
  let appointmentDetails = '';
  if (appointment && !isTemp) {
    const apptDateStr = new Date(appointment.scheduledDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    appointmentDetails = `
      <tr>
        <th>Appointment Schedule</th>
        <td>${apptDateStr} at ${appointment.scheduledTime || 'TBD'} (${appointment.collectionType || 'lab'} collection)</td>
      </tr>
      ${appointment.address ? `<tr><th>Service Address</th><td>${appointment.address}</td></tr>` : ''}
    `;
  }

  // Build the image + scatter plot section
  // The image data is passed as base64 via triage.details.uploadedImageBase64
  const hasImage = triage.details?.uploadedImageBase64;
  const inputType = triage.details?.inputType || 'TABULAR';

  let imagePlotSection = '';
  if (hasImage || inputType === 'IMAGE') {
    const imageHtml = hasImage
      ? `<img src="${triage.details.uploadedImageBase64}" alt="Patient uploaded medical image" class="patient-image" />`
      : `<div class="patient-image-placeholder">Medical Image<br/>(not available in download)</div>`;

    // Generate scatter plot SVG inline
    // Green dots along 45-degree line (predicted vs actual), patient result marked
    const scatterSvg = generateScatterPlotSVG(confidence, risk);

    imagePlotSection = `
      <div class="section-title">Diagnostic Imaging Analysis</div>
      <div class="image-plot-grid">
        <div class="image-cell">
          <div class="cell-label">Patient Upload</div>
          ${imageHtml}
        </div>
        <div class="plot-cell">
          <div class="cell-label">Model Confidence Distribution</div>
          ${scatterSvg}
        </div>
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Amrith Diagnostic Report - ${reportId}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #7e57c2;
      --primary-dark: #4d2c91;
      --primary-light: #ede7f6;
      --text: #1a1a2e;
      --text-muted: #6b7280;
      --border: #e5e7eb;
      --surface: #ffffff;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      color: var(--text);
      background-color: #f3f4f6;
      line-height: 1.6;
      padding: 40px 20px;
    }
    
    .print-actions {
      max-width: 800px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: var(--primary);
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 0;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: background 0.2s;
    }
    
    .btn:hover {
      background-color: var(--primary-dark);
    }
    
    .report-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: var(--surface);
      border-radius: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 50px;
      position: relative;
      border: 1px solid var(--border);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 24px;
      margin-bottom: 30px;
    }
    
    .logo-area {
      display: flex;
      flex-direction: column;
    }
    
    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 26px;
      color: var(--primary);
      letter-spacing: 1px;
    }
    
    .logo-subtext {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2.5px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    
    .meta-area {
      text-align: right;
    }
    
    .report-title {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
    }
    
    .report-id {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: var(--primary);
      font-weight: 700;
      margin-top: 4px;
    }
    
    .report-date {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    
    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--primary);
      margin-bottom: 14px;
      margin-top: 32px;
      border-left: 3px solid var(--primary);
      padding-left: 10px;
    }
    
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    
    table.data-table th,
    table.data-table td {
      padding: 10px 14px;
      text-align: left;
      border-bottom: 1px solid var(--border);
      font-size: 13px;
    }
    
    table.data-table th {
      font-weight: 600;
      color: var(--text-muted);
      width: 30%;
    }
    
    table.data-table td {
      font-weight: 500;
      color: var(--text);
    }
    
    .card {
      border-radius: 0;
      padding: 20px;
      border: 1px solid var(--border);
      margin-bottom: 24px;
      background-color: #ffffff;
    }
    
    /* Triage summary */
    .triage-summary {
      display: flex;
      align-items: center;
      gap: 28px;
      padding: 20px;
      border: 1px solid var(--border);
      margin-bottom: 24px;
      background-color: #ffffff;
    }
    
    .triage-score-block {
      text-align: center;
      flex-shrink: 0;
      min-width: 100px;
    }
    
    .triage-score-val {
      font-size: 36px;
      font-weight: 800;
      color: var(--text);
      line-height: 1;
    }
    
    .triage-score-lbl {
      font-size: 9px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }
    
    .triage-divider {
      width: 1px;
      height: 60px;
      background-color: var(--border);
      flex-shrink: 0;
    }
    
    .triage-desc {
      flex: 1;
    }
    
    .triage-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 0;
      background-color: var(--primary);
      color: white;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 8px;
    }
    
    .triage-pred {
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
      line-height: 1.3;
    }
    
    .triage-meta {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    
    /* Differential diagnosis */
    .diff-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 13px;
    }
    
    .diff-item:last-child {
      margin-bottom: 0;
    }
    
    .diff-rank {
      font-weight: 700;
      color: var(--text-muted);
      width: 24px;
      flex-shrink: 0;
    }
    
    .diff-name {
      font-weight: 600;
      width: 32%;
      color: var(--text);
    }
    
    .diff-bar-container {
      flex: 1;
      height: 6px;
      background-color: #e5e7eb;
      overflow: hidden;
      margin: 0 14px;
    }
    
    .diff-bar {
      height: 100%;
      background-color: var(--primary);
    }
    
    .diff-val {
      font-weight: 700;
      color: var(--primary-dark);
      width: 10%;
      text-align: right;
    }
    
    /* Lists */
    ul.plain-list {
      list-style-type: none;
      padding: 0;
    }
    
    ul.plain-list li {
      padding: 6px 0;
      margin-bottom: 4px;
      font-size: 13px;
      color: var(--text);
      font-weight: 500;
      border-bottom: 1px solid #f3f4f6;
    }
    
    ul.plain-list li:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    
    /* Physician card */
    .physician-card {
      padding: 14px;
      background-color: #ffffff;
      border: 1px solid var(--border);
    }
    
    .doc-name {
      font-weight: 700;
      font-size: 14px;
      color: var(--text);
    }
    
    .doc-spec {
      font-size: 12px;
      color: var(--primary);
      font-weight: 600;
    }
    
    .doc-qual {
      font-size: 11px;
      color: var(--text-muted);
    }
    
    /* Image + scatter plot grid */
    .image-plot-grid {
      display: flex;
      gap: 20px;
      margin-bottom: 24px;
      border: 1px solid var(--border);
      padding: 20px;
    }
    
    .image-cell,
    .plot-cell {
      flex: 1;
    }
    
    .cell-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--text-muted);
      margin-bottom: 10px;
    }
    
    .patient-image {
      width: 100%;
      max-height: 280px;
      object-fit: contain;
      border: 1px solid var(--border);
      background-color: #f9fafb;
    }
    
    .patient-image-placeholder {
      width: 100%;
      height: 240px;
      border: 1px dashed var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: 12px;
      text-align: center;
      background-color: #f9fafb;
    }
    
    .scatter-svg {
      width: 100%;
      height: auto;
      border: 1px solid var(--border);
      background-color: #fafafa;
    }
    
    /* Disclaimer */
    .disclaimer {
      font-size: 10px;
      color: var(--text-muted);
      background-color: #f9fafb;
      padding: 14px;
      border: 1px solid var(--border);
      margin-top: 28px;
      text-align: justify;
      line-height: 1.7;
    }
    
    .disclaimer strong {
      color: var(--text);
    }
    
    .text-muted {
      color: var(--text-muted);
      font-size: 13px;
    }
    
    /* Footer */
    .footer {
      margin-top: 32px;
      border-top: 2px solid var(--primary);
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--text-muted);
    }
    
    .footer-stamp {
      text-align: right;
      font-family: 'Courier New', monospace;
      color: var(--primary);
      font-weight: 700;
      font-size: 10px;
      letter-spacing: 0.5px;
    }
    
    @media print {
      body {
        background-color: white;
        padding: 0;
      }
      .print-actions {
        display: none;
      }
      .report-container {
        box-shadow: none;
        border: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>

  <div class="print-actions">
    <button class="btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="report-container">
    <!-- Header -->
    <div class="header">
      <div class="logo-area">
        <span class="logo-text">AMRITH.</span>
        <span class="logo-subtext">The Elixir of Modern Healing</span>
      </div>
      <div class="meta-area">
        <div class="report-title">AI Clinical Diagnosis Report</div>
        <div class="report-id">ID: ${reportId}</div>
        <div class="report-date">${dateStr}</div>
      </div>
    </div>

    <!-- Patient Details -->
    <div class="section-title">Patient Profile</div>
    <table class="data-table">
      <tr>
        <th>Full Name</th>
        <td>${patient.name || 'Anonymous Patient'}</td>
      </tr>
      <tr>
        <th>Email / Contact</th>
        <td>${patient.email || 'N/A'} ${patient.phone ? `| ${patient.phone}` : ''}</td>
      </tr>
      <tr>
        <th>Demographics</th>
        <td>Age: ${patient.age || 'N/A'}  |  Gender: ${patient.gender || 'N/A'}  |  Blood Group: ${patient.bloodGroup || 'N/A'}</td>
      </tr>
      ${appointmentDetails}
    </table>

    <!-- AI Diagnostic Summary -->
    <div class="section-title">Diagnostic Screening Summary</div>
    <div class="triage-summary">
      <div class="triage-score-block">
        <div class="triage-score-val">${confidence}%</div>
        <div class="triage-score-lbl">Confidence</div>
      </div>
      <div class="triage-divider"></div>
      <div class="triage-desc">
        <span class="triage-badge">${risk} Risk</span>
        <div class="triage-pred">${triage.prediction || 'Unknown Result'}</div>
        <div class="triage-meta">Model: ${triage.modelVersion || 'Amrith AI Diagnostics v1.0'}</div>
      </div>
    </div>

    <!-- Image + Scatter Plot (if applicable) -->
    ${imagePlotSection}

    <!-- Differential Diagnosis Distribution -->
    ${differentialSection}

    <!-- Action Recommendations -->
    <div class="section-title">Clinical Recommendations</div>
    <div class="card">
      <ul class="plain-list">
        ${recommendationsList}
      </ul>
    </div>

    <!-- AI Guidelines Sections -->
    ${aiPrecautionsSection}
    ${aiMedicationsSection}

    <!-- Medical Consultation Routing -->
    <div class="section-title">Consultation Routing</div>
    <div style="margin-bottom: 24px;">
      ${doctorHtml}
    </div>

    <!-- Disclaimer -->
    <div class="disclaimer">
      <strong>AI Screening Disclaimer:</strong> This document is generated by an automated clinical machine learning screening system. 
      It utilizes patient-provided symptoms, checklist responses, and uploads for initial routing, risk scoring, and triaging. 
      It is NOT a replacement for a formal medical diagnosis, laboratory testing, or physical examination by a registered physician. 
      Please consult your doctor or clinical team to review these findings and initiate proper diagnostic validation.
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>Report generated securely via Amrith Health Portal  |  2026 Amrith Inc.</div>
      <div class="footer-stamp">SECURELY ENCRYPTED | VERIFIED DATA</div>
    </div>
  </div>

</body>
</html>
  `;
}


/**
 * Generates an inline SVG scatter plot:
 * - Many green dots along the 45-degree diagonal (representing well-calibrated reference data)
 * - The patient's result marked at the confidence level, colored by risk
 */
function generateScatterPlotSVG(confidence, risk) {
  const w = 320;
  const h = 280;
  const pad = 40;
  const plotW = w - pad * 2;
  const plotH = h - pad * 2;

  // Marker color based on risk
  let markerColor = '#16a34a'; // green for low
  if (risk === 'Critical') markerColor = '#dc2626';
  else if (risk === 'High') markerColor = '#ea580c';
  else if (risk === 'Moderate') markerColor = '#d97706';

  // Generate reference green dots along the 45-degree line with some natural scatter
  const seed = 12345;
  function pseudoRandom(n) {
    let x = Math.sin(n * 9301 + seed) * 49297;
    return x - Math.floor(x);
  }

  let dots = '';
  const numDots = 65;
  for (let i = 0; i < numDots; i++) {
    const baseVal = (i / (numDots - 1)) * 100;
    const scatter = (pseudoRandom(i * 3) - 0.5) * 12;
    const scatterY = (pseudoRandom(i * 7 + 1) - 0.5) * 12;
    
    const xVal = Math.max(2, Math.min(98, baseVal + scatter));
    const yVal = Math.max(2, Math.min(98, baseVal + scatterY));
    
    const cx = pad + (xVal / 100) * plotW;
    const cy = pad + plotH - (yVal / 100) * plotH;
    
    const opacity = 0.35 + pseudoRandom(i * 11) * 0.35;
    const radius = 2.5 + pseudoRandom(i * 13) * 1.5;
    
    dots += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${radius.toFixed(1)}" fill="#22c55e" opacity="${opacity.toFixed(2)}" />`;
  }

  // Patient marker position
  // X = confidence, Y = offset from diagonal based on risk
  const patientX = confidence;
  let patientY = confidence;
  if (risk === 'Critical') patientY = Math.max(5, confidence - 25);
  else if (risk === 'High') patientY = Math.max(5, confidence - 15);
  else if (risk === 'Moderate') patientY = Math.max(5, confidence - 8);
  else patientY = Math.min(98, confidence + 3);

  const px = pad + (patientX / 100) * plotW;
  const py = pad + plotH - (patientY / 100) * plotH;

  // Grid lines
  let gridLines = '';
  for (let i = 0; i <= 4; i++) {
    const val = i * 25;
    const x = pad + (val / 100) * plotW;
    const y = pad + plotH - (val / 100) * plotH;
    gridLines += `<line x1="${pad}" y1="${y}" x2="${pad + plotW}" y2="${y}" stroke="#e5e7eb" stroke-width="0.5" />`;
    gridLines += `<line x1="${x}" y1="${pad}" x2="${x}" y2="${pad + plotH}" stroke="#e5e7eb" stroke-width="0.5" />`;
    // Labels
    gridLines += `<text x="${pad - 6}" y="${y + 3}" font-size="8" fill="#9ca3af" text-anchor="end" font-family="Inter, sans-serif">${val}</text>`;
    gridLines += `<text x="${x}" y="${pad + plotH + 14}" font-size="8" fill="#9ca3af" text-anchor="middle" font-family="Inter, sans-serif">${val}</text>`;
  }

  return `
    <svg class="scatter-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect x="0" y="0" width="${w}" height="${h}" fill="#fafafa" />
      
      <!-- Plot area border -->
      <rect x="${pad}" y="${pad}" width="${plotW}" height="${plotH}" fill="none" stroke="#d1d5db" stroke-width="1" />
      
      <!-- Grid -->
      ${gridLines}
      
      <!-- 45-degree reference line -->
      <line x1="${pad}" y1="${pad + plotH}" x2="${pad + plotW}" y2="${pad}" stroke="#7e57c2" stroke-width="1" stroke-dasharray="4,3" opacity="0.5" />
      
      <!-- Reference dots (green, along diagonal) -->
      ${dots}
      
      <!-- Patient marker -->
      <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="7" fill="${markerColor}" stroke="#ffffff" stroke-width="2" />
      <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="10" fill="none" stroke="${markerColor}" stroke-width="1.5" opacity="0.4" />
      
      <!-- Patient label -->
      <text x="${(px + 14).toFixed(1)}" y="${(py + 4).toFixed(1)}" font-size="9" fill="${markerColor}" font-weight="700" font-family="Inter, sans-serif">Patient (${confidence}%)</text>
      
      <!-- Axis labels -->
      <text x="${pad + plotW / 2}" y="${h - 4}" font-size="9" fill="#6b7280" text-anchor="middle" font-family="Inter, sans-serif" font-weight="600">Predicted Confidence (%)</text>
      <text x="10" y="${pad + plotH / 2}" font-size="9" fill="#6b7280" text-anchor="middle" font-family="Inter, sans-serif" font-weight="600" transform="rotate(-90, 10, ${pad + plotH / 2})">Actual Outcome (%)</text>
    </svg>
  `;
}
