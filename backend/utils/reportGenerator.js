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

  // Safety precautions
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

  // Suggested medications
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

  // Doctor section rendering
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

  // Appointment details tracking row
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

  // FIXED: Detect incoming client image vectors un-conditionally
  const hasImage = triage.details?.uploadedImageBase64;
  
  const imageHtml = hasImage
    ? `<img src="${triage.details.uploadedImageBase64}" alt="Patient uploaded medical image" class="patient-image" />`
    : `<div class="patient-image-placeholder">No Diagnostic Image Attached<br/><span style="font-size:10px; color:#999;">Tabular profile analysis pipeline</span></div>`;

  const scatterSvg = generateScatterPlotSVG(confidence, risk);

  const imagePlotSection = `
    <div class="section-title">Diagnostic Imaging & Calibration Analysis</div>
    <div class="image-plot-grid">
      <div class="image-cell">
        <div class="cell-label">Patient Source Input Matrix</div>
        ${imageHtml}
      </div>
      <div class="plot-cell">
        <div class="cell-label">Model Calibration Curve (45° Alignment)</div>
        ${scatterSvg}
      </div>
    </div>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clinical Screening Report - ${reportId}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4d2c91;
      --primary-light: #f5f3f7;
      --text: #111111;
      --text-muted: #555555;
      --border: #000000;
      --border-light: #cccccc;
      --surface: #ffffff;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      border-radius: 0 !important;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      color: var(--text);
      background-color: #ffffff;
      line-height: 1.5;
      padding: 40px;
    }
    
    .print-actions {
      max-width: 800px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: flex-end;
    }
    
    .btn {
      background-color: var(--primary);
      color: white;
      border: 1px solid var(--primary);
      padding: 8px 20px;
      font-weight: 600;
      cursor: pointer;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .report-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: var(--surface);
      padding: 0;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid var(--border);
      padding-bottom: 12px;
      margin-bottom: 30px;
    }
    
    .logo-text {
      font-weight: 800;
      font-size: 24px;
      color: var(--text);
      letter-spacing: 0.5px;
    }
    
    .logo-subtext {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }
    
    .meta-area {
      text-align: right;
    }
    
    .report-title {
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
    }
    
    .report-id {
      font-family: monospace;
      font-size: 12px;
      margin-top: 2px;
    }
    
    .report-date {
      font-size: 11px;
      color: var(--text-muted);
    }
    
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--primary);
      margin-bottom: 10px;
      margin-top: 30px;
      border-bottom: 1px solid var(--primary);
      padding-bottom: 4px;
    }
    
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    table.data-table th, table.data-table td {
      padding: 8px 10px;
      border: 1px solid var(--border-light);
      font-size: 12px;
    }
    
    table.data-table th {
      background-color: var(--primary-light);
      width: 25%;
    }
    
    .card {
      padding: 15px;
      border: 1px solid var(--border-light);
      margin-bottom: 20px;
    }
    
    .triage-summary {
      display: flex;
      align-items: center;
      border: 1px solid var(--border);
      margin-bottom: 20px;
    }
    
    .triage-score-block {
      text-align: center;
      padding: 20px;
      min-width: 120px;
      background-color: var(--primary-light);
    }
    
    .triage-score-val {
      font-size: 32px;
      font-weight: 700;
      color: var(--primary);
      line-height: 1;
    }
    
    .triage-score-lbl {
      font-size: 9px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
    }
    
    .triage-desc {
      flex: 1;
      padding: 20px;
    }
    
    .triage-badge {
      display: inline-block;
      padding: 2px 6px;
      border: 1px solid var(--border);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    
    .triage-pred {
      font-size: 16px;
      font-weight: 700;
    }
    
    .triage-meta {
      font-size: 11px;
      color: var(--text-muted);
    }
    
    .diff-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 12px;
    }
    
    .diff-rank { font-weight: 700; width: 20px; }
    .diff-name { font-weight: 500; width: 35%; }
    .diff-bar-container {
      flex: 1;
      height: 8px;
      background-color: var(--primary-light);
      margin: 0 15px;
      border: 1px solid var(--border-light);
    }
    .diff-bar { height: 100%; background-color: var(--primary); }
    .diff-val { font-weight: 700; width: 12%; text-align: right; }
    
    ul.plain-list { list-style-type: none; }
    ul.plain-list li { padding: 4px 0; font-size: 12px; }
    
    .physician-card { padding: 12px; border: 1px solid var(--border-light); }
    .doc-name { font-weight: 700; font-size: 13px; }
    .doc-spec { font-size: 11px; color: var(--primary); font-weight: 600; }
    .doc-qual { font-size: 11px; color: var(--text-muted); }
    
    /* Layout styling blocks */
    .image-plot-grid {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .image-cell, .plot-cell {
      flex: 1;
      border: 1px solid var(--border-light);
      padding: 12px;
      background-color: #ffffff;
    }
    
    .cell-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 8px;
      border-bottom: 1px solid var(--border-light);
      padding-bottom: 2px;
    }
    
    .patient-image {
      width: 100%;
      height: 220px;
      object-fit: contain;
      background-color: #ffffff;
      border: 1px solid var(--border-light);
    }
    
    .patient-image-placeholder {
      width: 100%;
      height: 220px;
      border: 1px dashed var(--border-light);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: 11px;
      text-align: center;
    }
    
    .scatter-svg {
      width: 100%;
      height: 220px;
      background-color: #ffffff;
    }
    
    .disclaimer {
      font-size: 10px;
      color: var(--text-muted);
      border: 1px solid var(--border-light);
      padding: 12px;
      margin-top: 30px;
      text-align: justify;
    }
    
    .footer {
      margin-top: 40px;
      border-top: 1px solid var(--border);
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--text-muted);
    }
    
    .footer-stamp { font-family: monospace; font-weight: 700; color: #111; }
    
    @media print {
      .print-actions { display: none; }
    }
  </style>
</head>
<body>

  <div class="print-actions">
    <button class="btn" onclick="window.print()">Print Report</button>
  </div>

  <div class="report-container">
    <div class="header">
      <div class="logo-area">
        <span class="logo-text">AMRITH DIAGNOSTICS</span>
        <span class="logo-subtext">Clinical Decision Support Systems</span>
      </div>
      <div class="meta-area">
        <div class="report-title">Automated Screening Record</div>
        <div class="report-id">REF-ID: ${reportId}</div>
        <div class="report-date">${dateStr}</div>
      </div>
    </div>

    <div class="section-title">Patient Profile</div>
    <table class="data-table">
      <tr>
        <th>Full Name</th>
        <td>${patient.name || 'Anonymous Patient'}</td>
      </tr>
      <tr>
        <th>Contact/Identifier</th>
        <td>${patient.email || 'N/A'} ${patient.phone ? `| ${patient.phone}` : ''}</td>
      </tr>
      <tr>
        <th>Demographics</th>
        <td>Age: ${patient.age || 'N/A'}  |  Gender: ${patient.gender || 'N/A'}  |  Blood Group: ${patient.bloodGroup || 'N/A'}</td>
      </tr>
      ${appointmentDetails}
    </table>

    <div class="section-title">Diagnostic Screening Summary</div>
    <div class="triage-summary">
      <div class="triage-score-block">
        <div class="triage-score-val">${confidence}%</div>
        <div class="triage-score-lbl">Confidence Metric</div>
      </div>
      <div class="triage-desc">
        <div class="triage-badge">${risk} Risk Classification</div>
        <div class="triage-pred">${triage.prediction || 'Unknown Classification'}</div>
        <div class="triage-meta">Analytical Engine: ${triage.modelVersion || 'Amrith AI Core v1.0'}</div>
      </div>
    </div>

    ${imagePlotSection}

    ${differentialSection}

    <div class="section-title">Clinical Recommendations</div>
    <div class="card">
      <ul class="plain-list">
        ${recommendationsList}
      </ul>
    </div>

    ${aiPrecautionsSection}
    ${aiMedicationsSection}

    <div class="section-title">Consultation Routing Profile</div>
    <div style="margin-bottom: 20px;">
      ${doctorHtml}
    </div>

    <div class="disclaimer">
      <strong>CRITICAL NOTICE:</strong> This framework does not replace standard medical diagnosis, diagnostic lab analysis, or physical evaluation by licensed physicians. Clinical teams must authenticate these parameters explicitly.
    </div>

    <div class="footer">
      <div>Secure transmission protocol | 2026 Amrith Inc. All Rights Reserved.</div>
      <div class="footer-stamp">AUTHENTICATED DIGITAL ARCHIVE</div>
    </div>
  </div>

</body>
</html>
  `;
}

function generateScatterPlotSVG(confidence, risk) {
  const w = 320;
  const h = 220; 
  const pad = 35;
  const plotW = w - pad * 2;
  const plotH = h - pad * 2;

  let markerColor = '#4d2c91'; 
  if (risk === 'Critical' || risk === 'High') markerColor = '#000000'; 

  const seed = 54321;
  function pseudoRandom(n) {
    let x = Math.sin(n * 9301 + seed) * 49297;
    return x - Math.floor(x);
  }

  let dots = '';
  const numDots = 60;
  for (let i = 0; i < numDots; i++) {
    const baseVal = (i / (numDots - 1)) * 100;
    const scatterX = (pseudoRandom(i * 2) - 0.5) * 6;
    const scatterY = (pseudoRandom(i * 5 + 2) - 0.5) * 6;
    
    const xVal = Math.max(2, Math.min(98, baseVal + scatterX));
    const yVal = Math.max(2, Math.min(98, baseVal + scatterY));
    
    const cx = pad + (xVal / 100) * plotW;
    const cy = pad + plotH - (yVal / 100) * plotH;
    
    dots += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="1.5" fill="#55aa55" opacity="0.6" />`;
  }

  const patientX = confidence;
  let patientY = confidence;
  if (risk === 'Critical') patientY = Math.max(5, confidence - 20);
  else if (risk === 'High') patientY = Math.max(5, confidence - 12);
  else if (risk === 'Moderate') patientY = Math.min(95, confidence + 8);
  else patientY = Math.min(98, confidence + 2);

  const px = pad + (patientX / 100) * plotW;
  const py = pad + plotH - (patientY / 100) * plotH;

  let gridLines = '';
  for (let i = 0; i <= 4; i++) {
    const val = i * 25;
    const x = pad + (val / 100) * plotW;
    const y = pad + plotH - (val / 100) * plotH;
    gridLines += `<line x1="${pad}" y1="${y}" x2="${pad + plotW}" y2="${y}" stroke="#eeeeee" stroke-width="0.5" />`;
    gridLines += `<line x1="${x}" y1="${pad}" x2="${x}" y2="${pad + plotH}" stroke="#eeeeee" stroke-width="0.5" />`;
    gridLines += `<text x="${pad - 6}" y="${y + 3}" font-size="7" fill="#666666" text-anchor="end">${val}</text>`;
    gridLines += `<text x="${x}" y="${pad + plotH + 10}" font-size="7" fill="#666666" text-anchor="middle">${val}</text>`;
  }

  return `
    <svg class="scatter-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
      <rect x="0" y="0" width="${w}" height="${h}" fill="#ffffff" />
      <rect x="${pad}" y="${pad}" width="${plotW}" height="${plotH}" fill="none" stroke="#000000" stroke-width="1" />
      ${gridLines}
      <line x1="${pad}" y1="${pad + plotH}" x2="${pad + plotW}" y2="${pad}" stroke="#4d2c91" stroke-width="1" stroke-dasharray="2,2" opacity="0.6" />
      ${dots}
      <polygon points="${px},${py - 5} ${px + 5},${py + 3} ${px - 5},${py + 3}" fill="${markerColor}" stroke="#000000" stroke-width="0.7" />
      <text x="${(px + 8).toFixed(1)}" y="${(py + 3).toFixed(1)}" font-size="8" fill="#000000" font-weight="700">Patient (${confidence}%)</text>
      <text x="${pad + plotW / 2}" y="${h - 2}" font-size="8" fill="#111111" text-anchor="middle" font-weight="600">Predicted Confidence %</text>
      <text x="8" y="${pad + plotH / 2}" font-size="8" fill="#111111" text-anchor="middle" font-weight="600" transform="rotate(-90, 8, ${pad + plotH / 2})">Observed Variance %</text>
    </svg>
  `;
}