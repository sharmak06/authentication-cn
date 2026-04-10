export type Role = "user" | "admin";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  role: Role;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          role?: Role;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          email?: string;
          role?: Role;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
