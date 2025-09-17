-- Create Finance & Control module tables

-- Financial accounts table
CREATE TABLE public.financial_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  account_code TEXT NOT NULL,
  description TEXT,
  balance NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Financial transactions table
CREATE TABLE public.financial_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  reference_number TEXT,
  debit_account_id UUID REFERENCES public.financial_accounts(id),
  credit_account_id UUID REFERENCES public.financial_accounts(id),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  category TEXT,
  project_id UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Budget table
CREATE TABLE public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  budget_name TEXT NOT NULL,
  fiscal_year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget NUMERIC NOT NULL,
  allocated_budget NUMERIC NOT NULL DEFAULT 0,
  spent_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'active', 'closed')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Budget line items table
CREATE TABLE public.budget_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  org_id UUID NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  allocated_amount NUMERIC NOT NULL,
  spent_amount NUMERIC NOT NULL DEFAULT 0,
  remaining_amount NUMERIC GENERATED ALWAYS AS (allocated_amount - spent_amount) STORED,
  account_id UUID REFERENCES public.financial_accounts(id),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Financial projects table (for project-based accounting)
CREATE TABLE public.financial_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  project_name TEXT NOT NULL,
  project_code TEXT NOT NULL,
  description TEXT,
  budget_allocated NUMERIC NOT NULL DEFAULT 0,
  budget_spent NUMERIC NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  manager_name TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team members table for finance module
CREATE TABLE public.finance_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  user_id UUID,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT DEFAULT 'Finance',
  salary NUMERIC,
  hire_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  currency TEXT NOT NULL DEFAULT 'USD',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Financial reports table
CREATE TABLE public.financial_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('income_statement', 'balance_sheet', 'cash_flow', 'budget_variance', 'project_summary')),
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  generated_data JSONB,
  file_path TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'approved', 'archived')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for financial_accounts
CREATE POLICY "Org members can view financial accounts" 
ON public.financial_accounts 
FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Org members can create financial accounts" 
ON public.financial_accounts 
FOR INSERT 
WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Creators or admins can update financial accounts" 
ON public.financial_accounts 
FOR UPDATE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

CREATE POLICY "Creators or admins can delete financial accounts" 
ON public.financial_accounts 
FOR DELETE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

-- Create RLS policies for financial_transactions
CREATE POLICY "Org members can view financial transactions" 
ON public.financial_transactions 
FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Org members can create financial transactions" 
ON public.financial_transactions 
FOR INSERT 
WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Creators or admins can update financial transactions" 
ON public.financial_transactions 
FOR UPDATE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

CREATE POLICY "Creators or admins can delete financial transactions" 
ON public.financial_transactions 
FOR DELETE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

-- Create RLS policies for budgets
CREATE POLICY "Org members can view budgets" 
ON public.budgets 
FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Org members can create budgets" 
ON public.budgets 
FOR INSERT 
WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Creators or admins can update budgets" 
ON public.budgets 
FOR UPDATE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

CREATE POLICY "Creators or admins can delete budgets" 
ON public.budgets 
FOR DELETE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

-- Create RLS policies for budget_line_items
CREATE POLICY "Org members can view budget line items" 
ON public.budget_line_items 
FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Org members can create budget line items" 
ON public.budget_line_items 
FOR INSERT 
WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Creators or admins can update budget line items" 
ON public.budget_line_items 
FOR UPDATE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

CREATE POLICY "Creators or admins can delete budget line items" 
ON public.budget_line_items 
FOR DELETE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

-- Create RLS policies for financial_projects
CREATE POLICY "Org members can view financial projects" 
ON public.financial_projects 
FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Org members can create financial projects" 
ON public.financial_projects 
FOR INSERT 
WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Creators or admins can update financial projects" 
ON public.financial_projects 
FOR UPDATE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

CREATE POLICY "Creators or admins can delete financial projects" 
ON public.financial_projects 
FOR DELETE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

-- Create RLS policies for finance_team_members
CREATE POLICY "Org members can view finance team members" 
ON public.finance_team_members 
FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Org members can create finance team members" 
ON public.finance_team_members 
FOR INSERT 
WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Creators or admins can update finance team members" 
ON public.finance_team_members 
FOR UPDATE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

CREATE POLICY "Creators or admins can delete finance team members" 
ON public.finance_team_members 
FOR DELETE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

-- Create RLS policies for financial_reports
CREATE POLICY "Org members can view financial reports" 
ON public.financial_reports 
FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Org members can create financial reports" 
ON public.financial_reports 
FOR INSERT 
WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Creators or admins can update financial reports" 
ON public.financial_reports 
FOR UPDATE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

CREATE POLICY "Creators or admins can delete financial reports" 
ON public.financial_reports 
FOR DELETE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

-- Create triggers for updated_at
CREATE TRIGGER update_financial_accounts_updated_at
BEFORE UPDATE ON public.financial_accounts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_financial_transactions_updated_at
BEFORE UPDATE ON public.financial_transactions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_budgets_updated_at
BEFORE UPDATE ON public.budgets
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_budget_line_items_updated_at
BEFORE UPDATE ON public.budget_line_items
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_financial_projects_updated_at
BEFORE UPDATE ON public.financial_projects
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_finance_team_members_updated_at
BEFORE UPDATE ON public.finance_team_members
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_financial_reports_updated_at
BEFORE UPDATE ON public.financial_reports
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_financial_accounts_org_id ON public.financial_accounts(org_id);
CREATE INDEX idx_financial_transactions_org_id ON public.financial_transactions(org_id);
CREATE INDEX idx_financial_transactions_date ON public.financial_transactions(transaction_date);
CREATE INDEX idx_budgets_org_id ON public.budgets(org_id);
CREATE INDEX idx_budget_line_items_budget_id ON public.budget_line_items(budget_id);
CREATE INDEX idx_financial_projects_org_id ON public.financial_projects(org_id);
CREATE INDEX idx_finance_team_members_org_id ON public.finance_team_members(org_id);
CREATE INDEX idx_financial_reports_org_id ON public.financial_reports(org_id);