export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      business_plans: {
        Row: {
          id: string
          user_id: string | null
          project_name: string
          sector: string
          city_region: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          project_name: string
          sector: string
          city_region: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          project_name?: string
          sector?: string
          city_region?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      market_data: {
        Row: {
          id: string
          business_plan_id: string
          target_customer: string
          market_size: string
          problem_solution: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_plan_id: string
          target_customer?: string
          market_size?: string
          problem_solution?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_plan_id?: string
          target_customer?: string
          market_size?: string
          problem_solution?: string
          created_at?: string
          updated_at?: string
        }
      }
      competitors: {
        Row: {
          id: string
          business_plan_id: string
          name: string
          price: number
          advantages: string
          weaknesses: string
          differentiation: string
          created_at: string
        }
        Insert: {
          id?: string
          business_plan_id: string
          name: string
          price?: number
          advantages?: string
          weaknesses?: string
          differentiation?: string
          created_at?: string
        }
        Update: {
          id?: string
          business_plan_id?: string
          name?: string
          price?: number
          advantages?: string
          weaknesses?: string
          differentiation?: string
          created_at?: string
        }
      }
      swot_analysis: {
        Row: {
          id: string
          business_plan_id: string
          strengths: Json
          weaknesses: Json
          opportunities: Json
          threats: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_plan_id: string
          strengths?: Json
          weaknesses?: Json
          opportunities?: Json
          threats?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_plan_id?: string
          strengths?: Json
          weaknesses?: Json
          opportunities?: Json
          threats?: Json
          created_at?: string
          updated_at?: string
        }
      }
      investments: {
        Row: {
          id: string
          business_plan_id: string
          name: string
          quantity: number
          unit_price_ht: number
          vat_rate: number
          total_ht: number
          vat_amount: number
          total_ttc: number
          created_at: string
        }
        Insert: {
          id?: string
          business_plan_id: string
          name: string
          quantity?: number
          unit_price_ht?: number
          vat_rate?: number
          created_at?: string
        }
        Update: {
          id?: string
          business_plan_id?: string
          name?: string
          quantity?: number
          unit_price_ht?: number
          vat_rate?: number
          created_at?: string
        }
      }
      fixed_costs: {
        Row: {
          id: string
          business_plan_id: string
          name: string
          monthly_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          business_plan_id: string
          name: string
          monthly_amount?: number
          created_at?: string
        }
        Update: {
          id?: string
          business_plan_id?: string
          name?: string
          monthly_amount?: number
          created_at?: string
        }
      }
      variable_costs: {
        Row: {
          id: string
          business_plan_id: string
          name: string
          rate_of_sales: number
          created_at: string
        }
        Insert: {
          id?: string
          business_plan_id: string
          name: string
          rate_of_sales?: number
          created_at?: string
        }
        Update: {
          id?: string
          business_plan_id?: string
          name?: string
          rate_of_sales?: number
          created_at?: string
        }
      }
      financial_projections: {
        Row: {
          id: string
          business_plan_id: string
          monthly_orders: number
          avg_price: number
          year_1_revenue: number
          year_2_revenue: number
          year_3_revenue: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_plan_id: string
          monthly_orders?: number
          avg_price?: number
          year_1_revenue?: number
          year_2_revenue?: number
          year_3_revenue?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_plan_id?: string
          monthly_orders?: number
          avg_price?: number
          year_1_revenue?: number
          year_2_revenue?: number
          year_3_revenue?: number
          created_at?: string
          updated_at?: string
        }
      }
      marketing_strategy: {
        Row: {
          id: string
          business_plan_id: string
          sales_strategy: string
          digital_marketing: string
          channels: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_plan_id: string
          sales_strategy?: string
          digital_marketing?: string
          channels?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_plan_id?: string
          sales_strategy?: string
          digital_marketing?: string
          channels?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
