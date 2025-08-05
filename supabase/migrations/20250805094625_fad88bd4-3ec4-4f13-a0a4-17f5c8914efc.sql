-- Create enums for organization types and status
CREATE TYPE organization_type AS ENUM ('NGO', 'Donor');
CREATE TYPE organization_status AS ENUM ('pending_verification', 'active', 'suspended');

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type organization_type NOT NULL,
  address TEXT NOT NULL,
  primary_currency TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  status organization_status DEFAULT 'pending_verification',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create organization_modules table
CREATE TABLE public.organization_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, module_name)
);

-- Enable RLS on organization_modules
ALTER TABLE public.organization_modules ENABLE ROW LEVEL SECURITY;

-- Create pricing_tiers table
CREATE TABLE public.pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  features JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default pricing tiers
INSERT INTO public.pricing_tiers (name, display_name, description, features) VALUES
('small_teams', 'Small Teams', 'Perfect for small organizations getting started', '["Up to 5 users", "Basic modules", "Email support", "5GB storage"]'),
('growing_teams', 'Growing Teams', 'Great for expanding organizations', '["Up to 25 users", "Advanced modules", "Priority support", "50GB storage", "Custom reports"]'),
('enterprise_branding', 'Enterprise & Branding', 'Full-featured for large organizations', '["Unlimited users", "All modules", "24/7 support", "Unlimited storage", "Custom branding", "API access"]');

-- Create organization_pricing table
CREATE TABLE public.organization_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  pricing_tier_id UUID REFERENCES public.pricing_tiers(id),
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on organization_pricing
ALTER TABLE public.organization_pricing ENABLE ROW LEVEL SECURITY;

-- Create registration_progress table
CREATE TABLE public.registration_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  organization_name TEXT,
  step_completed INTEGER DEFAULT 0,
  form_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on registration_progress
ALTER TABLE public.registration_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for organizations
CREATE POLICY "Users can view their own organization" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own organization" ON public.organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Create RLS policies for profiles
CREATE POLICY "Users can view profiles in their organization" ON public.profiles
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Create RLS policies for organization_modules
CREATE POLICY "Users can view their organization modules" ON public.organization_modules
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their organization modules" ON public.organization_modules
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Create RLS policies for organization_pricing
CREATE POLICY "Users can view their organization pricing" ON public.organization_pricing
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their organization pricing" ON public.organization_pricing
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Create RLS policies for registration_progress
CREATE POLICY "Users can view their own registration progress" ON public.registration_progress
  FOR SELECT USING (email = auth.email());

CREATE POLICY "Users can manage their own registration progress" ON public.registration_progress
  FOR ALL USING (email = auth.email());

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_registration_progress_updated_at
  BEFORE UPDATE ON public.registration_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create RPC function to register organization and user (bypasses RLS)
CREATE OR REPLACE FUNCTION public.register_organization_and_user(
  p_organization_name TEXT,
  p_organization_type organization_type,
  p_organization_address TEXT,
  p_primary_currency TEXT,
  p_contact_phone TEXT,
  p_full_name TEXT,
  p_email TEXT,
  p_password TEXT,
  p_selected_modules TEXT[],
  p_pricing_tier_name TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_organization_id UUID;
  v_user_id UUID;
  v_pricing_tier_id UUID;
  v_module TEXT;
  v_result JSON;
BEGIN
  -- Check if organization name already exists
  IF EXISTS (SELECT 1 FROM public.organizations WHERE name = p_organization_name) THEN
    RETURN json_build_object('error', 'Organization name already exists');
  END IF;

  -- Check if email already exists in auth.users
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RETURN json_build_object('error', 'Email already exists');
  END IF;

  -- Start transaction
  BEGIN
    -- Create organization
    INSERT INTO public.organizations (name, type, address, primary_currency, contact_phone, status)
    VALUES (p_organization_name, p_organization_type, p_organization_address, p_primary_currency, p_contact_phone, 'active')
    RETURNING id INTO v_organization_id;

    -- Create auth user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      p_email,
      crypt(p_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      json_build_object('full_name', p_full_name),
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO v_user_id;

    -- Create profile
    INSERT INTO public.profiles (id, organization_id, full_name, role)
    VALUES (v_user_id, v_organization_id, p_full_name, 'admin');

    -- Add selected modules
    FOREACH v_module IN ARRAY p_selected_modules
    LOOP
      INSERT INTO public.organization_modules (organization_id, module_name)
      VALUES (v_organization_id, v_module);
    END LOOP;

    -- Get pricing tier ID and add pricing
    SELECT id INTO v_pricing_tier_id FROM public.pricing_tiers WHERE name = p_pricing_tier_name;
    IF v_pricing_tier_id IS NOT NULL THEN
      INSERT INTO public.organization_pricing (organization_id, pricing_tier_id)
      VALUES (v_organization_id, v_pricing_tier_id);
    END IF;

    -- Clean up registration progress
    DELETE FROM public.registration_progress WHERE email = p_email;

    v_result := json_build_object(
      'success', true,
      'organization_id', v_organization_id,
      'user_id', v_user_id
    );

    RETURN v_result;

  EXCEPTION WHEN OTHERS THEN
    -- Rollback will happen automatically
    RETURN json_build_object('error', 'Registration failed: ' || SQLERRM);
  END;
END;
$$;

-- Create function to save registration progress
CREATE OR REPLACE FUNCTION public.save_registration_progress(
  p_email TEXT,
  p_step INTEGER,
  p_form_data JSONB
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.registration_progress (email, step_completed, form_data)
  VALUES (p_email, p_step, p_form_data)
  ON CONFLICT (email) 
  DO UPDATE SET 
    step_completed = p_step,
    form_data = p_form_data,
    updated_at = now();
    
  RETURN json_build_object('success', true);
END;
$$;

-- Create development users function
CREATE OR REPLACE FUNCTION public.create_dev_users()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_ngo_org_id UUID;
  v_donor_org_id UUID;
  v_ngo_user_id UUID;
  v_donor_user_id UUID;
  v_module TEXT;
  v_modules TEXT[] := ARRAY['Fundraising', 'Documents Manager', 'Programme Management', 'Procurement', 'Inventory Management', 'Finance & Control', 'Learning Management', 'HR Management', 'User Management', 'Grant Management'];
BEGIN
  -- Create NGO organization
  INSERT INTO public.organizations (name, type, address, primary_currency, contact_phone, status)
  VALUES ('Test NGO Organization', 'NGO', '123 NGO Street, City', 'USD', '+1234567890', 'active')
  RETURNING id INTO v_ngo_org_id;

  -- Create Donor organization
  INSERT INTO public.organizations (name, type, address, primary_currency, contact_phone, status)
  VALUES ('Test Donor Organization', 'Donor', '456 Donor Avenue, City', 'USD', '+0987654321', 'active')
  RETURNING id INTO v_donor_org_id;

  -- Create NGO user
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'user@ngo.com', crypt('Circuit2025$', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"NGO Test User"}', now(), now()
  ) RETURNING id INTO v_ngo_user_id;

  -- Create Donor user
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'user@donor.com', crypt('Circuit2025$', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"Donor Test User"}', now(), now()
  ) RETURNING id INTO v_donor_user_id;

  -- Create profiles
  INSERT INTO public.profiles (id, organization_id, full_name, role)
  VALUES 
    (v_ngo_user_id, v_ngo_org_id, 'NGO Test User', 'admin'),
    (v_donor_user_id, v_donor_org_id, 'Donor Test User', 'admin');

  -- Add all modules to both organizations
  FOREACH v_module IN ARRAY v_modules
  LOOP
    INSERT INTO public.organization_modules (organization_id, module_name)
    VALUES (v_ngo_org_id, v_module), (v_donor_org_id, v_module);
  END LOOP;

  -- Add pricing tiers
  INSERT INTO public.organization_pricing (organization_id, pricing_tier_id)
  SELECT v_ngo_org_id, id FROM public.pricing_tiers WHERE name = 'enterprise_branding'
  UNION ALL
  SELECT v_donor_org_id, id FROM public.pricing_tiers WHERE name = 'enterprise_branding';

  RETURN json_build_object('success', true, 'message', 'Development users created successfully');
END;
$$;

-- Create the development users
SELECT public.create_dev_users();