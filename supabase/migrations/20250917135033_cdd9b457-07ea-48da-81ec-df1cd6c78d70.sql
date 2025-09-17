-- Update sample data dates to 2025
UPDATE grants SET 
  start_date = '2025-01-01',
  end_date = '2025-12-31',
  next_report_due = '2025-03-15'
WHERE grant_name = 'Rural Health Initiative';

UPDATE grants SET 
  start_date = '2025-02-01',
  end_date = '2025-07-31',
  next_report_due = '2025-04-15'
WHERE grant_name = 'Education for All Program';

UPDATE grants SET 
  start_date = '2025-03-01',
  end_date = '2025-08-31',
  next_report_due = '2025-05-15'
WHERE grant_name = 'Clean Water Access Project';

UPDATE grants SET 
  start_date = '2025-04-01',
  end_date = '2025-09-30',
  next_report_due = '2025-06-15'
WHERE grant_name = 'Climate Resilience Initiative';

-- Update grant reports due dates to 2025
UPDATE grant_reports SET 
  due_date = CASE 
    WHEN report_type = 'Quarterly' AND due_date < '2025-01-01' THEN '2025-03-31'
    WHEN report_type = 'Monthly' AND due_date < '2025-01-01' THEN '2025-02-28'
    WHEN report_type = 'Annual' AND due_date < '2025-01-01' THEN '2025-12-31'
    WHEN report_type = 'Mid-term' AND due_date < '2025-01-01' THEN '2025-06-30'
    ELSE due_date
  END,
  submitted_date = CASE 
    WHEN submitted = true AND submitted_date < '2025-01-01' THEN '2025-01-15'
    ELSE submitted_date
  END;