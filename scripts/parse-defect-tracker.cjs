/*
  Script: parse-defect-tracker.cjs
  Purpose: Read DEFECT TRACKER.xlsx and print sheet names and Fundraising-related rows.
*/

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function main() {
  const repoRoot = process.cwd();
  const xlsxPath = path.join(repoRoot, 'DEFECT TRACKER.xlsx');

  if (!fs.existsSync(xlsxPath)) {
    console.error(`File not found: ${xlsxPath}`);
    process.exit(1);
  }

  const workbook = XLSX.readFile(xlsxPath);
  const sheetNames = workbook.SheetNames;
  console.log('Sheets:', sheetNames.join(', '));

  const fundraisingKeywords = [
    'fundraising', 'donor', 'opportunity', 'proposal', 'analytics', 'grants', 'document', 'e-signature'
  ];

  const results = [];

  for (const sheet of sheetNames) {
    const ws = workbook.Sheets[sheet];
    const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
    json.forEach((row, idx) => {
      const joined = Object.values(row).join(' ').toString().toLowerCase();
      const matches = fundraisingKeywords.some(k => joined.includes(k));
      if (matches) {
        results.push({ sheet, rowIndex: idx + 2, row }); // +2 accounts for header row + 1-based index
      }
    });
  }

  if (results.length === 0) {
    console.log('No Fundraising-related rows found.');
    return;
  }

  console.log(`Found ${results.length} Fundraising-related rows:`);
  for (const item of results) {
    console.log(`\n[${item.sheet}] Row ${item.rowIndex}`);
    console.log(JSON.stringify(item.row, null, 2));
  }
}

main();


