/*
  # Business Plans Application Schema

  1. New Tables
    - `business_plans`
      - Main table storing business plan header information
      - Fields: id, user_id, project_name, sector, city_region, language (fr/ar)
      - Timestamps: created_at, updated_at
    
    - `market_data`
      - Stores market study information
      - Fields: business_plan_id, target_customer, market_size, problem_solution
    
    - `competitors`
      - Competition analysis table
      - Fields: business_plan_id, name, price, advantages, weaknesses
    
    - `swot_analysis`
      - SWOT analysis data
      - Fields: business_plan_id, strengths, weaknesses, opportunities, threats (JSON arrays)
    
    - `investments`
      - Investment items with VAT calculations
      - Fields: business_plan_id, name, quantity, unit_price_ht, vat_rate, total_ht, vat_amount, total_ttc
    
    - `fixed_costs`
      - Fixed monthly costs
      - Fields: business_plan_id, name, monthly_amount
    
    - `variable_costs`
      - Variable costs as percentage of sales
      - Fields: business_plan_id, name, rate_of_sales
    
    - `financial_projections`
      - 3-year financial forecasts
      - Fields: business_plan_id, year_1_revenue, year_2_revenue, year_3_revenue, monthly_orders, avg_price
    
    - `marketing_strategy`
      - Marketing and sales strategies
      - Fields: business_plan_id, sales_strategy, digital_marketing, channels (JSON)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own business plans
    - Cascade delete on related tables when business plan is deleted

  3. Important Notes
    - All monetary values stored in MAD (Moroccan Dirham)
    - VAT rates: 0%, 7%, 10%, 14%, 20%
    - Bilingual support: French (fr) and Arabic (ar)
    - Automatic timestamps for audit trail
*/

-- Create business_plans table
CREATE TABLE IF NOT EXISTS business_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name text NOT NULL,
  sector text NOT NULL,
  city_region text NOT NULL,
  language text NOT NULL DEFAULT 'fr' CHECK (language IN ('fr', 'ar')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE business_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own business plans"
  ON business_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business plans"
  ON business_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business plans"
  ON business_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own business plans"
  ON business_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create market_data table
CREATE TABLE IF NOT EXISTS market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_plan_id uuid REFERENCES business_plans(id) ON DELETE CASCADE NOT NULL,
  target_customer text DEFAULT '',
  market_size text DEFAULT '',
  problem_solution text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own market data"
  ON market_data FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = market_data.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own market data"
  ON market_data FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = market_data.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own market data"
  ON market_data FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = market_data.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = market_data.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own market data"
  ON market_data FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = market_data.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

-- Create competitors table
CREATE TABLE IF NOT EXISTS competitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_plan_id uuid REFERENCES business_plans(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  price numeric DEFAULT 0,
  advantages text DEFAULT '',
  weaknesses text DEFAULT '',
  differentiation text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own competitors"
  ON competitors FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = competitors.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own competitors"
  ON competitors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = competitors.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own competitors"
  ON competitors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = competitors.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = competitors.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own competitors"
  ON competitors FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = competitors.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

-- Create swot_analysis table
CREATE TABLE IF NOT EXISTS swot_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_plan_id uuid REFERENCES business_plans(id) ON DELETE CASCADE NOT NULL,
  strengths jsonb DEFAULT '[]'::jsonb,
  weaknesses jsonb DEFAULT '[]'::jsonb,
  opportunities jsonb DEFAULT '[]'::jsonb,
  threats jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE swot_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own swot analysis"
  ON swot_analysis FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = swot_analysis.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own swot analysis"
  ON swot_analysis FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = swot_analysis.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own swot analysis"
  ON swot_analysis FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = swot_analysis.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = swot_analysis.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own swot analysis"
  ON swot_analysis FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = swot_analysis.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_plan_id uuid REFERENCES business_plans(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  quantity numeric DEFAULT 1,
  unit_price_ht numeric DEFAULT 0,
  vat_rate numeric DEFAULT 20,
  total_ht numeric GENERATED ALWAYS AS (quantity * unit_price_ht) STORED,
  vat_amount numeric GENERATED ALWAYS AS ((quantity * unit_price_ht) * (vat_rate / 100)) STORED,
  total_ttc numeric GENERATED ALWAYS AS ((quantity * unit_price_ht) * (1 + vat_rate / 100)) STORED,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own investments"
  ON investments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = investments.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own investments"
  ON investments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = investments.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own investments"
  ON investments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = investments.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = investments.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own investments"
  ON investments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = investments.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

-- Create fixed_costs table
CREATE TABLE IF NOT EXISTS fixed_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_plan_id uuid REFERENCES business_plans(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  monthly_amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fixed_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own fixed costs"
  ON fixed_costs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = fixed_costs.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own fixed costs"
  ON fixed_costs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = fixed_costs.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own fixed costs"
  ON fixed_costs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = fixed_costs.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = fixed_costs.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own fixed costs"
  ON fixed_costs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = fixed_costs.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

-- Create variable_costs table
CREATE TABLE IF NOT EXISTS variable_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_plan_id uuid REFERENCES business_plans(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  rate_of_sales numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE variable_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own variable costs"
  ON variable_costs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = variable_costs.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own variable costs"
  ON variable_costs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = variable_costs.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own variable costs"
  ON variable_costs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = variable_costs.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = variable_costs.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own variable costs"
  ON variable_costs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = variable_costs.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

-- Create financial_projections table
CREATE TABLE IF NOT EXISTS financial_projections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_plan_id uuid REFERENCES business_plans(id) ON DELETE CASCADE NOT NULL,
  monthly_orders numeric DEFAULT 0,
  avg_price numeric DEFAULT 0,
  year_1_revenue numeric DEFAULT 0,
  year_2_revenue numeric DEFAULT 0,
  year_3_revenue numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE financial_projections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own financial projections"
  ON financial_projections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = financial_projections.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own financial projections"
  ON financial_projections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = financial_projections.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own financial projections"
  ON financial_projections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = financial_projections.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = financial_projections.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own financial projections"
  ON financial_projections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = financial_projections.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

-- Create marketing_strategy table
CREATE TABLE IF NOT EXISTS marketing_strategy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_plan_id uuid REFERENCES business_plans(id) ON DELETE CASCADE NOT NULL,
  sales_strategy text DEFAULT '',
  digital_marketing text DEFAULT '',
  channels jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE marketing_strategy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own marketing strategy"
  ON marketing_strategy FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = marketing_strategy.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own marketing strategy"
  ON marketing_strategy FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = marketing_strategy.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own marketing strategy"
  ON marketing_strategy FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = marketing_strategy.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = marketing_strategy.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own marketing strategy"
  ON marketing_strategy FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_plans
      WHERE business_plans.id = marketing_strategy.business_plan_id
      AND business_plans.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_plans_user_id ON business_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_market_data_business_plan_id ON market_data(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_competitors_business_plan_id ON competitors(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_swot_business_plan_id ON swot_analysis(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_investments_business_plan_id ON investments(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_fixed_costs_business_plan_id ON fixed_costs(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_variable_costs_business_plan_id ON variable_costs(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_financial_projections_business_plan_id ON financial_projections(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_marketing_strategy_business_plan_id ON marketing_strategy(business_plan_id);