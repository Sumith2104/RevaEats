export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          category: string
          image_url: string
          is_available: boolean
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          category: string
          image_url: string
          is_available?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          category?: string
          image_url?: string
          is_available?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          order_time: string
          ordered_by_phone: string
          status: "New" | "Preparing" | "Ready for Pickup" | "Completed"
          total: number
        }
        Insert: {
          id?: string
          order_time?: string
          ordered_by_phone: string
          status?: "New" | "Preparing" | "Ready for Pickup" | "Completed"
          total: number
        }
        Update: {
          id?: string
          order_time?: string
          ordered_by_phone?: string
          status?: "New" | "Preparing" | "Ready for Pickup" | "Completed"
          total?: number
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string
          quantity: number
          price: number
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id: string
          quantity: number
          price: number
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string
          quantity?: number
          price?: number
        }
      }
      users: {
        Row: {
          name: string
          phone: string
        }
        Insert: {
          name: string
          phone: string
        }
        Update: {
          name?: string
          phone?: string
        }
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { 
      order_status: "New" | "Preparing" | "Ready for Pickup" | "Completed"
    }
    CompositeTypes: { [_ in never]: never }
  }
}
