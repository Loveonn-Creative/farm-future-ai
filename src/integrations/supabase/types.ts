export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      payment_verifications: {
        Row: {
          ai_confidence: number | null
          ai_response: Json | null
          amount_expected: number | null
          amount_verified: number | null
          created_at: string
          id: string
          plan_type: string
          screenshot_url: string
          transaction_id: string | null
          upi_id_verified: string | null
          user_id: string
          verification_status: string
        }
        Insert: {
          ai_confidence?: number | null
          ai_response?: Json | null
          amount_expected?: number | null
          amount_verified?: number | null
          created_at?: string
          id?: string
          plan_type?: string
          screenshot_url: string
          transaction_id?: string | null
          upi_id_verified?: string | null
          user_id: string
          verification_status?: string
        }
        Update: {
          ai_confidence?: number | null
          ai_response?: Json | null
          amount_expected?: number | null
          amount_verified?: number | null
          created_at?: string
          id?: string
          plan_type?: string
          screenshot_url?: string
          transaction_id?: string | null
          upi_id_verified?: string | null
          user_id?: string
          verification_status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          district: string | null
          id: string
          language_preference: string
          phone: string | null
          primary_crops: string[] | null
          state: string | null
          total_land_bigha: number | null
          updated_at: string
          village: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          district?: string | null
          id: string
          language_preference?: string
          phone?: string | null
          primary_crops?: string[] | null
          state?: string | null
          total_land_bigha?: number | null
          updated_at?: string
          village?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          district?: string | null
          id?: string
          language_preference?: string
          phone?: string | null
          primary_crops?: string[] | null
          state?: string | null
          total_land_bigha?: number | null
          updated_at?: string
          village?: string | null
        }
        Relationships: []
      }
      soil_scans: {
        Row: {
          analysis_summary: string | null
          area_bigha: number | null
          comparison_note: string | null
          confidence_score: number | null
          created_at: string
          crop_type: string | null
          extracted_text: string | null
          gps_coordinates: Json | null
          id: string
          image_url: string | null
          insights: Json | null
          land_category: string | null
          language: string | null
          latitude: number | null
          longitude: number | null
          moisture_percentage: number | null
          nitrogen_level: string | null
          organic_matter_percentage: number | null
          ph_level: number | null
          phosphorus_level: string | null
          plot_name: string | null
          potassium_level: string | null
          precision_level: string | null
          raw_response: Json | null
          recommendations: string[] | null
          scan_category: string | null
          scan_type: string
          session_id: string | null
          soil_type: string | null
          user_id: string | null
        }
        Insert: {
          analysis_summary?: string | null
          area_bigha?: number | null
          comparison_note?: string | null
          confidence_score?: number | null
          created_at?: string
          crop_type?: string | null
          extracted_text?: string | null
          gps_coordinates?: Json | null
          id?: string
          image_url?: string | null
          insights?: Json | null
          land_category?: string | null
          language?: string | null
          latitude?: number | null
          longitude?: number | null
          moisture_percentage?: number | null
          nitrogen_level?: string | null
          organic_matter_percentage?: number | null
          ph_level?: number | null
          phosphorus_level?: string | null
          plot_name?: string | null
          potassium_level?: string | null
          precision_level?: string | null
          raw_response?: Json | null
          recommendations?: string[] | null
          scan_category?: string | null
          scan_type?: string
          session_id?: string | null
          soil_type?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_summary?: string | null
          area_bigha?: number | null
          comparison_note?: string | null
          confidence_score?: number | null
          created_at?: string
          crop_type?: string | null
          extracted_text?: string | null
          gps_coordinates?: Json | null
          id?: string
          image_url?: string | null
          insights?: Json | null
          land_category?: string | null
          language?: string | null
          latitude?: number | null
          longitude?: number | null
          moisture_percentage?: number | null
          nitrogen_level?: string | null
          organic_matter_percentage?: number | null
          ph_level?: number | null
          phosphorus_level?: string | null
          plot_name?: string | null
          potassium_level?: string | null
          precision_level?: string | null
          raw_response?: Json | null
          recommendations?: string[] | null
          scan_category?: string | null
          scan_type?: string
          session_id?: string | null
          soil_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          access_code: string
          activated_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          phone: string
          plan_type: string | null
          session_id: string | null
        }
        Insert: {
          access_code: string
          activated_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          phone: string
          plan_type?: string | null
          session_id?: string | null
        }
        Update: {
          access_code?: string
          activated_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string
          plan_type?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          access_code: string | null
          activated_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          plan_type: string
          user_id: string
        }
        Insert: {
          access_code?: string | null
          activated_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          plan_type?: string
          user_id: string
        }
        Update: {
          access_code?: string | null
          activated_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          plan_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "premium" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "premium", "admin"],
    },
  },
} as const
