export interface ListingRow {
  id: string;
  title: string;
  description: string;
  price: number;
  seller_email: string;
  category: string;
  image_url: string;
  image_urls: string[];
  location: string;
  condition: string;
  created_at: string;
  status?: 'active' | 'sold';
}

export interface MessageRow {
  id: string;
  listing_id: string;
  buyer_email: string;
  message: string;
  created_at: string;
}

export type ListingInsert = Omit<ListingRow, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type MessageInsert = Omit<MessageRow, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      listings: {
        Row: ListingRow;
        Insert: ListingInsert;
        Update: Partial<ListingInsert>;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: MessageInsert;
        Update: Partial<MessageInsert>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
