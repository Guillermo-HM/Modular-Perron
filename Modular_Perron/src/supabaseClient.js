import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://khmeadsalacxzjljkoqv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobWVhZHNhbGFjeHpqbGprb3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNzUyNDEsImV4cCI6MjA5Nzc1MTI0MX0.bGXQaI3ZNB8KgdNYqEoYvbwp4GFKSvtWc4e212kIZxI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)