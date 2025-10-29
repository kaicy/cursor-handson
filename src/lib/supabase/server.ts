import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 서버 액션용 클라이언트
export const createServerClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

