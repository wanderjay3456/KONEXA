import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

// Supabase에 저장된 인재 정보의 '형태'를 규정합니다. (TypeScript)
export interface TalentProfile {
  id: string
  tech_stack: string[]
  visa_score: number
  is_verified: boolean
}

export function useTalentData() {
  const [talents, setTalents] = useState<TalentProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTalents() {
      try {
        // Supabase의 'talent_profiles' 테이블에서 모든 데이터(*)를 가져옵니다.
        const { data, error } = await supabase
          .from('talent_profiles')
          .select('*')

        if (error) throw error
        setTalents(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTalents()
  }, [])

  return { talents, isLoading, error }
}
