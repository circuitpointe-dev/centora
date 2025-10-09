
-- Insert sample compliance documents for the organization
DO $$
DECLARE
  v_org_id uuid := 'c21e6282-30c3-4aa9-b646-339007d22a4f';
  v_user_id uuid := '4cb00802-5ef8-4567-8b71-9be9e2701ad0';
BEGIN
  -- Insert sample compliance documents
  INSERT INTO documents (
    org_id, 
    title, 
    file_name, 
    file_path, 
    category, 
    status,
    description,
    mime_type,
    file_size,
    created_by,
    version
  ) VALUES
  (
    v_org_id,
    'Annual Financial Audit Report 2024',
    'financial_audit_2024.pdf',
    v_org_id || '/compliance/financial_audit_2024.pdf',
    'compliance',
    'active',
    'Independent auditor report for fiscal year 2024 ensuring financial transparency and compliance with accounting standards.',
    'application/pdf',
    2458624,
    v_user_id,
    '1.0'
  ),
  (
    v_org_id,
    'Data Protection Policy - GDPR Compliance',
    'gdpr_compliance_policy.pdf',
    v_org_id || '/compliance/gdpr_compliance_policy.pdf',
    'compliance',
    'active',
    'Organizational policy ensuring compliance with GDPR regulations for data protection and privacy.',
    'application/pdf',
    1843200,
    v_user_id,
    '2.1'
  ),
  (
    v_org_id,
    'Tax Exemption Certificate 2024-2025',
    'tax_exemption_cert_2024.pdf',
    v_org_id || '/compliance/tax_exemption_cert_2024.pdf',
    'compliance',
    'active',
    '501(c)(3) tax exemption certificate valid for 2024-2025 fiscal year.',
    'application/pdf',
    524288,
    v_user_id,
    '1.0'
  ),
  (
    v_org_id,
    'Code of Conduct & Ethics Policy',
    'code_of_conduct.pdf',
    v_org_id || '/compliance/code_of_conduct.pdf',
    'compliance',
    'active',
    'Organizational code of conduct outlining ethical standards and behavioral expectations for all staff and volunteers.',
    'application/pdf',
    1048576,
    v_user_id,
    '3.0'
  ),
  (
    v_org_id,
    'Donor Privacy Policy',
    'donor_privacy_policy.pdf',
    v_org_id || '/compliance/donor_privacy_policy.pdf',
    'compliance',
    'active',
    'Policy governing the collection, use, and protection of donor personal information.',
    'application/pdf',
    786432,
    v_user_id,
    '1.2'
  ),
  (
    v_org_id,
    'Anti-Money Laundering (AML) Policy',
    'aml_policy.pdf',
    v_org_id || '/compliance/aml_policy.pdf',
    'compliance',
    'active',
    'Procedures for preventing, detecting, and reporting money laundering activities.',
    'application/pdf',
    1310720,
    v_user_id,
    '1.0'
  ),
  (
    v_org_id,
    'Board Meeting Minutes - Q4 2024',
    'board_minutes_q4_2024.pdf',
    v_org_id || '/compliance/board_minutes_q4_2024.pdf',
    'compliance',
    'active',
    'Official minutes from the Board of Directors quarterly meeting in Q4 2024.',
    'application/pdf',
    655360,
    v_user_id,
    '1.0'
  ),
  (
    v_org_id,
    'Safeguarding Policy',
    'safeguarding_policy.pdf',
    v_org_id || '/compliance/safeguarding_policy.pdf',
    'compliance',
    'active',
    'Child protection and vulnerable adult safeguarding policy ensuring safety in all programs.',
    'application/pdf',
    1572864,
    v_user_id,
    '2.0'
  );

  -- Add some compliance tags
  INSERT INTO document_tags (org_id, name, color, bg_color, text_color, created_by)
  VALUES 
    (v_org_id, 'Regulatory', '#DC2626', 'bg-red-100', 'text-red-800', v_user_id),
    (v_org_id, 'Financial', '#059669', 'bg-green-100', 'text-green-800', v_user_id),
    (v_org_id, 'Legal', '#7C3AED', 'bg-purple-100', 'text-purple-800', v_user_id),
    (v_org_id, 'Governance', '#2563EB', 'bg-blue-100', 'text-blue-800', v_user_id),
    (v_org_id, 'Annual', '#F59E0B', 'bg-amber-100', 'text-amber-800', v_user_id)
  ON CONFLICT DO NOTHING;

END $$;
