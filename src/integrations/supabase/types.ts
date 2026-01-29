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
      app_user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          performed_at: string
          performed_by: string | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string
          performed_by?: string | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string
          performed_by?: string | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      claims: {
        Row: {
          amount_approved: number | null
          amount_claimed: number | null
          claim_number: string
          claimant_type: string
          clause_reference: string | null
          contract_id: string
          created_at: string
          description: string | null
          detailed_claim_due_date: string | null
          detailed_claim_submitted_at: string | null
          determination_date: string | null
          engineer_determination: string | null
          id: string
          is_time_barred: boolean | null
          notice_date: string
          status: string
          submitted_by: string
          time_approved_days: number | null
          time_extension_days: number | null
          title: string
          updated_at: string
        }
        Insert: {
          amount_approved?: number | null
          amount_claimed?: number | null
          claim_number: string
          claimant_type: string
          clause_reference?: string | null
          contract_id: string
          created_at?: string
          description?: string | null
          detailed_claim_due_date?: string | null
          detailed_claim_submitted_at?: string | null
          determination_date?: string | null
          engineer_determination?: string | null
          id?: string
          is_time_barred?: boolean | null
          notice_date?: string
          status?: string
          submitted_by: string
          time_approved_days?: number | null
          time_extension_days?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          amount_approved?: number | null
          amount_claimed?: number | null
          claim_number?: string
          claimant_type?: string
          clause_reference?: string | null
          contract_id?: string
          created_at?: string
          description?: string | null
          detailed_claim_due_date?: string | null
          detailed_claim_submitted_at?: string | null
          determination_date?: string | null
          engineer_determination?: string | null
          id?: string
          is_time_barred?: boolean | null
          notice_date?: string
          status?: string
          submitted_by?: string
          time_approved_days?: number | null
          time_extension_days?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_notices: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          clause_reference: string | null
          content: string | null
          contract_id: string
          created_at: string
          id: string
          issued_at: string
          issued_by: string
          notice_type: string
          reference_number: string
          response_deadline: string | null
          response_required: boolean | null
          subject: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          clause_reference?: string | null
          content?: string | null
          contract_id: string
          created_at?: string
          id?: string
          issued_at?: string
          issued_by: string
          notice_type: string
          reference_number: string
          response_deadline?: string | null
          response_required?: boolean | null
          subject: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          clause_reference?: string | null
          content?: string | null
          contract_id?: string
          created_at?: string
          id?: string
          issued_at?: string
          issued_by?: string
          notice_type?: string
          reference_number?: string
          response_deadline?: string | null
          response_required?: boolean | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_notices_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          accepted_contract_amount: number
          actual_completion_date: string | null
          advance_payment_percentage: number | null
          commencement_date: string | null
          completion_date: string | null
          contract_number: string
          contractor_id: string | null
          created_at: string
          defects_notification_period: number | null
          delay_damages_cap_percentage: number | null
          delay_damages_rate: number | null
          employer_id: string | null
          engineer_id: string | null
          id: string
          project_id: string | null
          retention_percentage: number | null
          status: string
          taking_over_date: string | null
          time_for_completion: number
          title: string
          updated_at: string
        }
        Insert: {
          accepted_contract_amount: number
          actual_completion_date?: string | null
          advance_payment_percentage?: number | null
          commencement_date?: string | null
          completion_date?: string | null
          contract_number: string
          contractor_id?: string | null
          created_at?: string
          defects_notification_period?: number | null
          delay_damages_cap_percentage?: number | null
          delay_damages_rate?: number | null
          employer_id?: string | null
          engineer_id?: string | null
          id?: string
          project_id?: string | null
          retention_percentage?: number | null
          status?: string
          taking_over_date?: string | null
          time_for_completion: number
          title: string
          updated_at?: string
        }
        Update: {
          accepted_contract_amount?: number
          actual_completion_date?: string | null
          advance_payment_percentage?: number | null
          commencement_date?: string | null
          completion_date?: string | null
          contract_number?: string
          contractor_id?: string | null
          created_at?: string
          defects_notification_period?: number | null
          delay_damages_cap_percentage?: number | null
          delay_damages_rate?: number | null
          employer_id?: string | null
          engineer_id?: string | null
          id?: string
          project_id?: string | null
          retention_percentage?: number | null
          status?: string
          taking_over_date?: string | null
          time_for_completion?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      disagreements: {
        Row: {
          agreement_deadline: string | null
          claim_id: string | null
          contract_id: string
          created_at: string
          description: string | null
          determination_date: string | null
          engineer_determination: string | null
          id: string
          raised_at: string
          raised_by: string
          reference_number: string
          resolution_summary: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          agreement_deadline?: string | null
          claim_id?: string | null
          contract_id: string
          created_at?: string
          description?: string | null
          determination_date?: string | null
          engineer_determination?: string | null
          id?: string
          raised_at?: string
          raised_by: string
          reference_number: string
          resolution_summary?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          agreement_deadline?: string | null
          claim_id?: string | null
          contract_id?: string
          created_at?: string
          description?: string | null
          determination_date?: string | null
          engineer_determination?: string | null
          id?: string
          raised_at?: string
          raised_by?: string
          reference_number?: string
          resolution_summary?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disagreements_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disagreements_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      document_submissions: {
        Row: {
          contract_id: string
          created_at: string
          description: string | null
          document_type: string
          file_url: string | null
          id: string
          parent_submission_id: string | null
          reference_number: string
          review_comments: string | null
          review_deadline: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          revision_number: number | null
          status: string
          submitted_at: string
          submitted_by: string
          title: string
          updated_at: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          description?: string | null
          document_type: string
          file_url?: string | null
          id?: string
          parent_submission_id?: string | null
          reference_number: string
          review_comments?: string | null
          review_deadline?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision_number?: number | null
          status?: string
          submitted_at?: string
          submitted_by: string
          title: string
          updated_at?: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          description?: string | null
          document_type?: string
          file_url?: string | null
          id?: string
          parent_submission_id?: string | null
          reference_number?: string
          review_comments?: string | null
          review_deadline?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision_number?: number | null
          status?: string
          submitted_at?: string
          submitted_by?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_submissions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_submissions_parent_submission_id_fkey"
            columns: ["parent_submission_id"]
            isOneToOne: false
            referencedRelation: "document_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          checklist_items: Json | null
          completed_date: string | null
          created_at: string
          id: string
          inspector_id: string | null
          inspector_name: string
          location: string | null
          notes: string | null
          pass_rate: number | null
          photos: string[] | null
          priority: string
          project_id: string | null
          scheduled_date: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          checklist_items?: Json | null
          completed_date?: string | null
          created_at?: string
          id?: string
          inspector_id?: string | null
          inspector_name: string
          location?: string | null
          notes?: string | null
          pass_rate?: number | null
          photos?: string[] | null
          priority?: string
          project_id?: string | null
          scheduled_date: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          checklist_items?: Json | null
          completed_date?: string | null
          created_at?: string
          id?: string
          inspector_id?: string | null
          inspector_name?: string
          location?: string | null
          notes?: string | null
          pass_rate?: number | null
          photos?: string[] | null
          priority?: string
          project_id?: string | null
          scheduled_date?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          email: string
          full_name: string
          hourly_rate: number | null
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          hourly_rate?: number | null
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          hourly_rate?: number | null
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
        }
        Relationships: []
      }
      time_entries: {
        Row: {
          break_minutes: number | null
          clock_in: string | null
          clock_out: string | null
          created_at: string
          date: string
          description: string | null
          hours_worked: number
          id: string
          overtime_hours: number | null
          project_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          break_minutes?: number | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string
          date: string
          description?: string | null
          hours_worked: number
          id?: string
          overtime_hours?: number | null
          project_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          break_minutes?: number | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string
          date?: string
          description?: string | null
          hours_worked?: number
          id?: string
          overtime_hours?: number | null
          project_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      timesheets: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          overtime_hours: number
          rejection_reason: string | null
          status: string
          submitted_at: string | null
          total_hours: number
          updated_at: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          overtime_hours?: number
          rejection_reason?: string | null
          status?: string
          submitted_at?: string | null
          total_hours?: number
          updated_at?: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          overtime_hours?: number
          rejection_reason?: string | null
          status?: string
          submitted_at?: string | null
          total_hours?: number
          updated_at?: string
          user_id?: string
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["fidic_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["fidic_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["fidic_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_app_user_role: {
        Args: { _user_id?: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_role: { Args: { target_user_id: string }; Returns: string }
      has_app_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_fidic_role: {
        Args: {
          _role: Database["public"]["Enums"]["fidic_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_app_admin: { Args: { _user_id?: string }; Returns: boolean }
      is_app_manager_or_admin: { Args: { _user_id?: string }; Returns: boolean }
      is_manager_or_admin: { Args: never; Returns: boolean }
      update_user_role: {
        Args: {
          _new_role: Database["public"]["Enums"]["app_role"]
          _target_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "employee" | "manager" | "admin"
      fidic_role: "engineer" | "contractor" | "project_architect" | "employer"
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
      app_role: ["employee", "manager", "admin"],
      fidic_role: ["engineer", "contractor", "project_architect", "employer"],
    },
  },
} as const
