import type { Grant, GrantReport, GrantDisbursement, GrantCompliance } from '@/types/grants';

interface GrantExportData {
  grant: Grant;
  reports?: GrantReport[];
  disbursements?: GrantDisbursement[];
  compliance?: GrantCompliance[];
}

export const exportGrantToPDF = async (data: GrantExportData): Promise<void> => {
  // Create HTML content for the report
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Grant Report - ${data.grant.grant_name}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px;
          color: #333;
        }
        .header { 
          border-bottom: 2px solid #6366f1; 
          padding-bottom: 20px; 
          margin-bottom: 30px;
        }
        .title { 
          color: #6366f1; 
          margin: 0;
          font-size: 24px;
        }
        .subtitle { 
          color: #666; 
          margin: 5px 0 0 0;
          font-size: 14px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .info-item {
          padding: 10px;
          background: #f8fafc;
          border-radius: 6px;
        }
        .info-label {
          font-weight: bold;
          color: #374151;
          margin-bottom: 5px;
        }
        .info-value {
          color: #6b7280;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 15px;
          font-size: 18px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background-color: #f3f4f6;
          font-weight: bold;
        }
        .status-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        .status-active { background-color: #dcfce7; color: #166534; }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-completed { background-color: #dcfce7; color: #166534; }
        .status-overdue { background-color: #fee2e2; color: #dc2626; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">${data.grant.grant_name}</h1>
        <p class="subtitle">Grant Report - Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Donor</div>
          <div class="info-value">${data.grant.donor_name}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Amount</div>
          <div class="info-value">$${data.grant.amount.toLocaleString()}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Start Date</div>
          <div class="info-value">${new Date(data.grant.start_date).toLocaleDateString()}</div>
        </div>
        <div class="info-item">
          <div class="info-label">End Date</div>
          <div class="info-value">${new Date(data.grant.end_date).toLocaleDateString()}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Status</div>
          <div class="info-value">${data.grant.status}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Program Area</div>
          <div class="info-value">${data.grant.program_area || 'Not specified'}</div>
        </div>
      </div>

      ${data.grant.description ? `
        <div class="section">
          <h2 class="section-title">Description</h2>
          <p>${data.grant.description}</p>
        </div>
      ` : ''}

      ${data.reports && data.reports.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Reports</h2>
          <table>
            <thead>
              <tr>
                <th>Report Type</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Submitted Date</th>
              </tr>
            </thead>
            <tbody>
              ${data.reports.map(report => `
                <tr>
                  <td>${report.report_type}</td>
                  <td>${new Date(report.due_date).toLocaleDateString()}</td>
                  <td><span class="status-badge status-${report.status}">${report.status}</span></td>
                  <td>${report.submitted_date ? new Date(report.submitted_date).toLocaleDateString() : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      ${data.disbursements && data.disbursements.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Disbursements</h2>
          <table>
            <thead>
              <tr>
                <th>Milestone</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Disbursed On</th>
              </tr>
            </thead>
            <tbody>
              ${data.disbursements.map(disbursement => `
                <tr>
                  <td>${disbursement.milestone}</td>
                  <td>$${disbursement.amount.toLocaleString()}</td>
                  <td>${new Date(disbursement.due_date).toLocaleDateString()}</td>
                  <td><span class="status-badge status-${disbursement.status}">${disbursement.status}</span></td>
                  <td>${disbursement.disbursed_on ? new Date(disbursement.disbursed_on).toLocaleDateString() : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      ${data.compliance && data.compliance.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Compliance</h2>
          <table>
            <thead>
              <tr>
                <th>Requirement</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Evidence Document</th>
              </tr>
            </thead>
            <tbody>
              ${data.compliance.map(compliance => `
                <tr>
                  <td>${compliance.requirement}</td>
                  <td>${new Date(compliance.due_date).toLocaleDateString()}</td>
                  <td><span class="status-badge status-${compliance.status}">${compliance.status.replace('_', ' ')}</span></td>
                  <td>${compliance.evidence_document ? 'Yes' : 'No'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
    </body>
    </html>
  `;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

export const exportGrantToExcel = (data: GrantExportData): void => {
  // Create CSV content
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Grant Information
  csvContent += "Grant Information\n";
  csvContent += `Grant Name,${data.grant.grant_name}\n`;
  csvContent += `Donor,${data.grant.donor_name}\n`;
  csvContent += `Amount,$${data.grant.amount}\n`;
  csvContent += `Start Date,${new Date(data.grant.start_date).toLocaleDateString()}\n`;
  csvContent += `End Date,${new Date(data.grant.end_date).toLocaleDateString()}\n`;
  csvContent += `Status,${data.grant.status}\n`;
  csvContent += `Program Area,${data.grant.program_area || 'Not specified'}\n`;
  csvContent += `Region,${data.grant.region || 'Not specified'}\n\n`;

  // Reports
  if (data.reports && data.reports.length > 0) {
    csvContent += "Reports\n";
    csvContent += "Report Type,Due Date,Status,Submitted Date\n";
    data.reports.forEach(report => {
      csvContent += `${report.report_type},${new Date(report.due_date).toLocaleDateString()},${report.status},${report.submitted_date ? new Date(report.submitted_date).toLocaleDateString() : '-'}\n`;
    });
    csvContent += "\n";
  }

  // Disbursements
  if (data.disbursements && data.disbursements.length > 0) {
    csvContent += "Disbursements\n";
    csvContent += "Milestone,Amount,Due Date,Status,Disbursed On\n";
    data.disbursements.forEach(disbursement => {
      csvContent += `${disbursement.milestone},$${disbursement.amount},${new Date(disbursement.due_date).toLocaleDateString()},${disbursement.status},${disbursement.disbursed_on ? new Date(disbursement.disbursed_on).toLocaleDateString() : '-'}\n`;
    });
    csvContent += "\n";
  }

  // Compliance
  if (data.compliance && data.compliance.length > 0) {
    csvContent += "Compliance\n";
    csvContent += "Requirement,Due Date,Status,Evidence Document\n";
    data.compliance.forEach(compliance => {
      csvContent += `${compliance.requirement},${new Date(compliance.due_date).toLocaleDateString()},${compliance.status.replace('_', ' ')},${compliance.evidence_document ? 'Yes' : 'No'}\n`;
    });
  }

  // Create and download file
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `grant-report-${data.grant.grant_name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};