/**
 * Amrith Medical Report Generator
 * Compiles patient diagnostic and triage details into a premium printable HTML report.
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
  
  // Theme styling based on risk level
  const risk = triage.riskLevel || triage.risk || 'Low';
  let themeColor = '#10B981'; // Emerald
  let themeBg = '#ECFDF5';
  let themeBorder = '#A7F3D0';
  
  if (risk === 'Critical') {
    themeColor = '#EF4444'; // Red
    themeBg = '#FEF2F2';
    themeBorder = '#FCA5A5';
  } else if (risk === 'High') {
    themeColor = '#F97316'; // Orange
    themeBg = '#FFF7ED';
    themeBorder = '#FED7AA';
  } else if (risk === 'Moderate') {
    themeColor = '#F59E0B'; // Amber
    themeBg = '#FEF3C7';
    themeBorder = '#FDE68A';
  }

  // differential diagnosis items
  let differentialSection = '';
  if (triage.details?.top_predictions && triage.details.top_predictions.length > 0) {
    const listItems = triage.details.top_predictions.slice(0, 4).map(p => `
      <div class="diff-item">
        <span class="diff-name">${p.disease}</span>
        <div class="diff-bar-container">
          <div class="diff-bar" style="width: ${p.confidence}%"></div>
        </div>
        <span class="diff-val">${p.confidence}%</span>
      </div>
    `).join('');

    differentialSection = `
      <div class="section-title">Differential Diagnosis Distribution</div>
      <div class="card bg-gray-50">
        ${listItems}
      </div>
    `;
  }

  // recommendations items
  const recs = triage.details?.recommendations || [
    'Consult a qualified physician for detailed clinical evaluation.',
    'Keep a detailed symptom diary to share with your doctor.',
    'Do not self-medicate or alter current prescriptions based on this report.'
  ];
  const recommendationsList = recs.map(r => `<li>${r}</li>`).join('');

  // AI precautions and medications HTML
  let aiPrecautionsSection = '';
  if (triage.details?.ai_precautions && Array.isArray(triage.details.ai_precautions) && triage.details.ai_precautions.length > 0) {
    const pList = triage.details.ai_precautions.map(p => `<li>${p}</li>`).join('');
    aiPrecautionsSection = `
      <div class="section-title">AI-Suggested Safety Precautions</div>
      <div class="card bg-precaution">
        <ul class="recs-list precaution-list">
          ${pList}
        </ul>
      </div>
    `;
  }

  let aiMedicationsSection = '';
  if (triage.details?.ai_medications && Array.isArray(triage.details.ai_medications) && triage.details.ai_medications.length > 0) {
    const mList = triage.details.ai_medications.map(m => `<li>${m}</li>`).join('');
    aiMedicationsSection = `
      <div class="section-title">AI-Suggested Medications & Treatments</div>
      <div class="card bg-medication">
        <ul class="recs-list medication-list">
          ${mList}
        </ul>
      </div>
    `;
  }


  // Doctor section HTML
  let doctorHtml = '<p class="text-muted">No physician consultation booked yet.</p>';
  if (doctor) {
    doctorHtml = `
      <div class="physician-card">
        <div class="doc-icon">👨‍⚕️</div>
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
        <div class="doc-icon">👨‍⚕️</div>
        <div>
          <div class="doc-name">Dr. ${appointment.doctorName}</div>
          <div class="doc-spec">${appointment.departmentName || 'Medical Specialist'}</div>
        </div>
      </div>
    `;
  }

  // Scheduled date details
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
      --text: #2c223a;
      --text-muted: #8c839f;
      --border: #e8dff0;
      --surface: #ffffff;
      --theme: ${themeColor};
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      color: var(--text);
      background-color: #f6f5fa;
      line-height: 1.5;
      padding: 40px 20px;
    }
    
    .print-actions {
      max-width: 800px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: var(--primary);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      text-decoration: none;
      transition: background 0.2s;
    }
    
    .btn:hover {
      background-color: var(--primary-dark);
    }
    
    .btn-outline {
      background-color: transparent;
      color: var(--primary);
      border: 2px solid var(--primary);
    }
    
    .btn-outline:hover {
      background-color: rgba(126, 87, 194, 0.05);
    }
    
    .report-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: var(--surface);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(126, 87, 194, 0.05);
      padding: 50px;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-b: 2px solid var(--border);
      padding-bottom: 30px;
      margin-bottom: 30px;
      border-bottom: 2px solid #f3eef7;
    }
    
    .logo-area {
      display: flex;
      flex-direction: column;
    }
    
    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 28px;
      color: var(--primary);
      letter-spacing: 1px;
    }
    
    .logo-subtext {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--text-muted);
      margin-top: -2px;
    }
    
    .meta-area {
      text-align: right;
    }
    
    .report-title {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--text);
    }
    
    .report-id {
      font-family: monospace;
      font-size: 14px;
      color: var(--primary);
      font-weight: bold;
      margin-top: 4px;
    }
    
    .report-date {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    
    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--primary);
      margin-bottom: 15px;
      margin-top: 30px;
      border-left: 3px solid var(--primary);
      padding-left: 10px;
    }
    
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    
    table.data-table th, table.data-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #f3eef7;
      font-size: 14px;
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
      border-radius: 12px;
      padding: 24px;
      border: 1px solid var(--border);
      margin-bottom: 25px;
    }
    
    .bg-gray-50 {
      background-color: #faf9fc;
    }
    
    .bg-triage {
      background-color: ${themeBg};
      border-color: ${themeBorder};
      display: flex;
      align-items: center;
      gap: 30px;
    }
    
    .triage-score-ring {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      border: 8px solid ${themeBorder};
      border-top-color: ${themeColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background-color: white;
    }
    
    .triage-score-val {
      font-size: 22px;
      font-weight: 800;
      color: var(--text);
      line-height: 1;
    }
    
    .triage-score-lbl {
      font-size: 8px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-top: 2px;
    }
    
    .triage-desc {
      flex: 1;
    }
    
    .triage-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 99px;
      background-color: ${themeColor};
      color: white;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    
    .triage-pred {
      font-size: 20px;
      font-weight: 700;
      color: var(--text);
    }
    
    .triage-meta {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    
    .diff-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 13px;
    }
    
    .diff-item:last-child {
      margin-bottom: 0;
    }
    
    .diff-name {
      font-weight: 600;
      width: 35%;
      color: var(--text);
    }
    
    .diff-bar-container {
      flex: 1;
      height: 8px;
      background-color: #e8dff0;
      border-radius: 4px;
      overflow: hidden;
      margin: 0 15px;
    }
    
    .diff-bar {
      height: 100%;
      background-color: var(--primary);
      border-radius: 4px;
    }
    
    .diff-val {
      font-weight: 700;
      color: var(--primary-dark);
      width: 10%;
      text-align: right;
    }
    
    ul.recs-list {
      list-style-type: none;
    }
    
    ul.recs-list li {
      position: relative;
      padding-left: 25px;
      margin-bottom: 10px;
      font-size: 13.5px;
      color: #4b3b60;
      font-weight: 500;
    }
    
    ul.recs-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #10B981;
      font-weight: bold;
      font-size: 16px;
    }
    
    .bg-precaution {
      background-color: #fffbeb;
      border-color: #fef3c7;
    }
    
    .bg-medication {
      background-color: #f0fdf4;
      border-color: #dcfce7;
    }
    
    ul.precaution-list li::before {
      content: '⚠️' !important;
      font-size: 12px !important;
      top: 1px;
    }
    
    ul.medication-list li::before {
      content: '💊' !important;
      font-size: 12px !important;
      top: 1px;
    }

    
    .physician-card {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      background-color: #faf9fc;
      border: 1px solid var(--border);
      border-radius: 12px;
    }
    
    .doc-icon {
      font-size: 28px;
      background-color: #f3eef7;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
    }
    
    .doc-name {
      font-weight: 700;
      font-size: 15px;
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
    
    .disclaimer {
      font-size: 10.5px;
      color: var(--text-muted);
      background-color: #f7f6f9;
      padding: 15px;
      border-radius: 10px;
      border: 1px dashed var(--border);
      margin-top: 30px;
      text-align: justify;
    }
    
    .footer {
      margin-top: 40px;
      border-top: 1px solid #f3eef7;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--text-muted);
    }
    
    .footer-stamp {
      text-align: right;
      font-family: monospace;
      color: var(--primary);
      font-weight: bold;
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
    <a href="#" class="btn btn-outline" onclick="window.history.back(); return false;">← Go Back</a>
    <button class="btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
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
        <td>${patient.email || 'N/A'} ${patient.phone ? `• ${patient.phone}` : ''}</td>
      </tr>
      <tr>
        <th>Demographics</th>
        <td>Age: ${patient.age || 'N/A'} • Gender: ${patient.gender || 'N/A'} • Blood Group: ${patient.bloodGroup || 'N/A'}</td>
      </tr>
      ${appointmentDetails}
    </table>

    <!-- AI Diagnostic Summary -->
    <div class="section-title">Diagnostic Screening Summary</div>
    <div class="card bg-triage">
      <div class="triage-score-ring">
        <span class="triage-score-val">${triage.confidence || '0'}%</span>
        <span class="triage-score-lbl">Confidence</span>
      </div>
      <div class="triage-desc">
        <span class="triage-badge">${risk} Risk</span>
        <div class="triage-pred">${triage.prediction || 'Unknown Result'}</div>
        <div class="triage-meta">Model: ${triage.modelVersion || 'Amrith AI Diagnostics v1.0'}</div>
      </div>
    </div>

    <!-- Differential Diagnosis Distribution -->
    ${differentialSection}

    <!-- Action Recommendations -->
    <div class="section-title">Clinical Recommendations</div>
    <div class="card bg-gray-50">
      <ul class="recs-list">
        ${recommendationsList}
      </ul>
    </div>

    <!-- AI Guidelines Sections -->
    ${aiPrecautionsSection}
    ${aiMedicationsSection}


    <!-- Medical Consultation Routing -->
    <div class="section-title">Consultation Routing</div>
    <div style="margin-bottom: 25px;">
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
      <div>Report generated securely via Amrith Health Portal • © 2026 Amrith Inc.</div>
      <div class="footer-stamp">SECURELY ENCRYPTED • VERIFIED DATA</div>
    </div>
  </div>

</body>
</html>
  `;
}
