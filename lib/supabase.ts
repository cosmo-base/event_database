// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oqomwuhrvqoozfujgtsj.storage.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xb213dWhydnFvb3pmdWpndHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDI0NjUsImV4cCI6MjA5MDQxODQ2NX0.ixgdZ-pVn_IB-PpR_yTzP40kVppBVWmuIFIUqC4rFjU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)