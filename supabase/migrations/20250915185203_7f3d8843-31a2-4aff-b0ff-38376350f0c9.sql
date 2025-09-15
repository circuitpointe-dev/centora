-- Create grants management tables
CREATE TYPE grant_status AS ENUM ('active', 'closed', 'pending', 'cancelled');
CREATE TYPE compliance_status AS ENUM ('completed', 'in_progress', 'overdue');
CREATE TYPE disbursement_status AS ENUM ('pending', 'released', 'cancelled');
CREATE TYPE report_status AS ENUM ('submitted', 'overdue', 'upcoming', 'in_progress');

-- Grants table
CREATE TABLE grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  grant_name TEXT NOT NULL,
  donor_name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status grant_status NOT NULL DEFAULT 'pending',
  program_area TEXT,
  region TEXT,
  description TEXT,
  track_status TEXT,
  next_report_due DATE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant compliance requirements table
CREATE TABLE grant_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_id UUID NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
  requirement TEXT NOT NULL,
  due_date DATE NOT NULL,
  status compliance_status NOT NULL DEFAULT 'in_progress',
  evidence_document TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant disbursements table
CREATE TABLE grant_disbursements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_id UUID NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
  milestone TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  due_date DATE NOT NULL,
  disbursed_on DATE,
  status disbursement_status NOT NULL DEFAULT 'pending',
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant reports table
CREATE TABLE grant_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_id UUID NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  due_date DATE NOT NULL,
  submitted BOOLEAN DEFAULT FALSE,
  status report_status NOT NULL DEFAULT 'upcoming',
  submitted_date DATE,
  file_name TEXT,
  file_path TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_disbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for grants
CREATE POLICY "Org members can view grants" ON grants FOR SELECT USING (is_org_member(org_id));
CREATE POLICY "Org members can create grants" ON grants FOR INSERT WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());
CREATE POLICY "Creators or admins can update grants" ON grants FOR UPDATE USING ((created_by = auth.uid()) OR is_org_admin(org_id));
CREATE POLICY "Creators or admins can delete grants" ON grants FOR DELETE USING ((created_by = auth.uid()) OR is_org_admin(org_id));

-- RLS policies for grant_compliance
CREATE POLICY "Users can view grant compliance" ON grant_compliance FOR SELECT USING (EXISTS (SELECT 1 FROM grants g WHERE g.id = grant_compliance.grant_id AND is_org_member(g.org_id)));
CREATE POLICY "Users can create compliance records" ON grant_compliance FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM grants g WHERE g.id = grant_compliance.grant_id AND is_org_member(g.org_id)) AND created_by = auth.uid());
CREATE POLICY "Creators or admins can update compliance" ON grant_compliance FOR UPDATE USING ((created_by = auth.uid()) OR EXISTS (SELECT 1 FROM grants g WHERE g.id = grant_compliance.grant_id AND is_org_admin(g.org_id)));
CREATE POLICY "Creators or admins can delete compliance" ON grant_compliance FOR DELETE USING ((created_by = auth.uid()) OR EXISTS (SELECT 1 FROM grants g WHERE g.id = grant_compliance.grant_id AND is_org_admin(g.org_id)));

-- RLS policies for grant_disbursements
CREATE POLICY "Users can view grant disbursements" ON grant_disbursements FOR SELECT USING (EXISTS (SELECT 1 FROM grants g WHERE g.id = grant_disbursements.grant_id AND is_org_member(g.org_id)));
CREATE POLICY "Users can create disbursement records" ON grant_disbursements FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM grants g WHERE g.id = grant_disbursements.grant_id AND is_org_member(g.org_id)) AND created_by = auth.uid());
CREATE POLICY "Creators or admins can update disbursements" ON grant_disbursements FOR UPDATE USING ((created_by = auth.uid()) OR EXISTS (SELECT 1 FROM grants g WHERE g.id = grant_disbursements.grant_id AND is_org_admin(g.org_id)));
CREATE POLICY "Creators or admins can delete disbursements" ON grant_disbursements FOR DELETE USING ((created_by = auth.uid()) OR EXISTS (SELECT 1 FROM grants g WHERE g.id = grant_disbursements.grant_id AND is_org_admin(g.org_id)));

-- RLS policies for grant_reports
CREATE POLICY "Users can view grant reports" ON grant_reports FOR SELECT USING (EXISTS (SELECT 1 FROM grants g WHERE g.id = grant_reports.grant_id AND is_org_member(g.org_id)));
CREATE POLICY "Users can create report records" ON grant_reports FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM grants g WHERE g.id = grant_reports.grant_id AND is_org_member(g.org_id)) AND created_by = auth.uid());
CREATE POLICY "Creators or admins can update reports" ON grant_reports FOR UPDATE USING ((created_by = auth.uid()) OR EXISTS (SELECT 1 FROM grants g WHERE g.id = grant_reports.grant_id AND is_org_admin(g.org_id)));
CREATE POLICY "Creators or admins can delete reports" ON grant_reports FOR DELETE USING ((created_by = auth.uid()) OR EXISTS (SELECT 1 FROM grants g WHERE g.id = grant_reports.grant_id AND is_org_admin(g.org_id)));

-- Create updated_at triggers
CREATE TRIGGER update_grants_updated_at BEFORE UPDATE ON grants FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_grant_compliance_updated_at BEFORE UPDATE ON grant_compliance FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_grant_disbursements_updated_at BEFORE UPDATE ON grant_disbursements FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_grant_reports_updated_at BEFORE UPDATE ON grant_reports FOR EACH ROW EXECUTE FUNCTION set_updated_at();