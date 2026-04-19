import { createClient } from '@supabase/supabase-js'

// 대표님이 .env 파일에 적어둔 열쇠를 자동으로 불러옵니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 만약 열쇠를 못 찾으면 에러를 띄워 알려줍니다.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 환경변수(URL 또는 KEY)를 찾을 수 없습니다! .env 파일을 확인해주세요.')
}

// 공식 통신 케이블(supabase)을 생성하여 내보냅니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
