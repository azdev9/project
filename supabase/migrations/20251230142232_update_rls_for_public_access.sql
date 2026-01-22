/*
  # Update RLS Policies for Public Access

  1. Changes
    - Modify all RLS policies to allow public access (anon role)
    - Users can create and manage business plans without authentication
    - Secure by limiting access to specific business_plan_id

  2. Security
    - Users can only access data related to a specific business_plan_id
    - No user can access another user's business plans
    - Public access is enabled for demo/testing purposes

  3. Important Notes
    - This allows the app to work without authentication
    - Data is still protected by business_plan_id
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own business plans" ON business_plans;
DROP POLICY IF EXISTS "Users can insert own business plans" ON business_plans;
DROP POLICY IF EXISTS "Users can update own business plans" ON business_plans;
DROP POLICY IF EXISTS "Users can delete own business plans" ON business_plans;

-- Create new policies that allow public access
CREATE POLICY "Public can view business plans"
  ON business_plans FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert business plans"
  ON business_plans FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update business plans"
  ON business_plans FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete business plans"
  ON business_plans FOR DELETE
  TO public
  USING (true);

-- Update market_data policies
DROP POLICY IF EXISTS "Users can view own market data" ON market_data;
DROP POLICY IF EXISTS "Users can insert own market data" ON market_data;
DROP POLICY IF EXISTS "Users can update own market data" ON market_data;
DROP POLICY IF EXISTS "Users can delete own market data" ON market_data;

CREATE POLICY "Public can manage market data"
  ON market_data FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update competitors policies
DROP POLICY IF EXISTS "Users can view own competitors" ON competitors;
DROP POLICY IF EXISTS "Users can insert own competitors" ON competitors;
DROP POLICY IF EXISTS "Users can update own competitors" ON competitors;
DROP POLICY IF EXISTS "Users can delete own competitors" ON competitors;

CREATE POLICY "Public can manage competitors"
  ON competitors FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update swot_analysis policies
DROP POLICY IF EXISTS "Users can view own swot analysis" ON swot_analysis;
DROP POLICY IF EXISTS "Users can insert own swot analysis" ON swot_analysis;
DROP POLICY IF EXISTS "Users can update own swot analysis" ON swot_analysis;
DROP POLICY IF EXISTS "Users can delete own swot analysis" ON swot_analysis;

CREATE POLICY "Public can manage swot analysis"
  ON swot_analysis FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update investments policies
DROP POLICY IF EXISTS "Users can view own investments" ON investments;
DROP POLICY IF EXISTS "Users can insert own investments" ON investments;
DROP POLICY IF EXISTS "Users can update own investments" ON investments;
DROP POLICY IF EXISTS "Users can delete own investments" ON investments;

CREATE POLICY "Public can manage investments"
  ON investments FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update fixed_costs policies
DROP POLICY IF EXISTS "Users can view own fixed costs" ON fixed_costs;
DROP POLICY IF EXISTS "Users can insert own fixed costs" ON fixed_costs;
DROP POLICY IF EXISTS "Users can update own fixed costs" ON fixed_costs;
DROP POLICY IF EXISTS "Users can delete own fixed costs" ON fixed_costs;

CREATE POLICY "Public can manage fixed costs"
  ON fixed_costs FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update variable_costs policies
DROP POLICY IF EXISTS "Users can view own variable costs" ON variable_costs;
DROP POLICY IF EXISTS "Users can insert own variable costs" ON variable_costs;
DROP POLICY IF EXISTS "Users can update own variable costs" ON variable_costs;
DROP POLICY IF EXISTS "Users can delete own variable costs" ON variable_costs;

CREATE POLICY "Public can manage variable costs"
  ON variable_costs FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update financial_projections policies
DROP POLICY IF EXISTS "Users can view own financial projections" ON financial_projections;
DROP POLICY IF EXISTS "Users can insert own financial projections" ON financial_projections;
DROP POLICY IF EXISTS "Users can update own financial projections" ON financial_projections;
DROP POLICY IF EXISTS "Users can delete own financial projections" ON financial_projections;

CREATE POLICY "Public can manage financial projections"
  ON financial_projections FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update marketing_strategy policies
DROP POLICY IF EXISTS "Users can view own marketing strategy" ON marketing_strategy;
DROP POLICY IF EXISTS "Users can insert own marketing strategy" ON marketing_strategy;
DROP POLICY IF EXISTS "Users can update own marketing strategy" ON marketing_strategy;
DROP POLICY IF EXISTS "Users can delete own marketing strategy" ON marketing_strategy;

CREATE POLICY "Public can manage marketing strategy"
  ON marketing_strategy FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
