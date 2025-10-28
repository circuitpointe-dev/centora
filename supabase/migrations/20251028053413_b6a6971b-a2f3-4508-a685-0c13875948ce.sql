
-- Fix RLS policies for procurement_plan_items
DROP POLICY IF EXISTS "org access" ON procurement_plan_items;

CREATE POLICY "Users can view plan items from their organization"
  ON procurement_plan_items
  FOR SELECT
  USING (
    org_id IN (
      SELECT profiles.org_id
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert plan items for their organization"
  ON procurement_plan_items
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT profiles.org_id
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update plan items from their organization"
  ON procurement_plan_items
  FOR UPDATE
  USING (
    org_id IN (
      SELECT profiles.org_id
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete plan items from their organization"
  ON procurement_plan_items
  FOR DELETE
  USING (
    org_id IN (
      SELECT profiles.org_id
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Fix RLS policies for procurement_plans
DROP POLICY IF EXISTS "org_members_can_manage_plans" ON procurement_plans;

CREATE POLICY "Users can view plans from their organization"
  ON procurement_plans
  FOR SELECT
  USING (
    org_id IN (
      SELECT profiles.org_id
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert plans for their organization"
  ON procurement_plans
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT profiles.org_id
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update plans from their organization"
  ON procurement_plans
  FOR UPDATE
  USING (
    org_id IN (
      SELECT profiles.org_id
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete plans from their organization"
  ON procurement_plans
  FOR DELETE
  USING (
    org_id IN (
      SELECT profiles.org_id
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Fix RLS policies for procurement_approval_rules
DROP POLICY IF EXISTS "org access" ON procurement_approval_rules;

CREATE POLICY "Users can view approval rules from their organization"
  ON procurement_approval_rules
  FOR SELECT
  USING (
    org_id IN (
      SELECT profiles.org_id
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert approval rules for their organization"
  ON procurement_approval_rules
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT profiles.org_id
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update approval rules from their organization"
  ON procurement_approval_rules
  FOR UPDATE
  USING (
    org_id IN (
      SELECT profiles.org_id
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete approval rules from their organization"
  ON procurement_approval_rules
  FOR DELETE
  USING (
    org_id IN (
      SELECT profiles.org_id
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );
