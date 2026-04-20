export interface Database {
  public: {
    Tables: {
      sales: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          sale_date: string;
          product_name: string;
          product_category: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          payment_method: "cash" | "pix" | "debit_card" | "credit_card";
          installments: number | null;
          customer_name: string | null;
          order_code: string | null;
          status: "pending" | "paid" | "completed" | "cancelled";
          notes: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          sale_date: string;
          product_name: string;
          product_category?: string | null;
          quantity: number;
          unit_price: number;
          payment_method?: "cash" | "pix" | "debit_card" | "credit_card";
          installments?: number | null;
          customer_name?: string | null;
          order_code?: string | null;
          status: "pending" | "paid" | "completed" | "cancelled";
          notes?: string | null;
          user_id?: string;
        };
        Update: {
          sale_date?: string;
          product_name?: string;
          product_category?: string | null;
          quantity?: number;
          unit_price?: number;
          payment_method?: "cash" | "pix" | "debit_card" | "credit_card";
          installments?: number | null;
          customer_name?: string | null;
          order_code?: string | null;
          status?: "pending" | "paid" | "completed" | "cancelled";
          notes?: string | null;
          user_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
