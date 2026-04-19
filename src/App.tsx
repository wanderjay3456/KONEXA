import { useTalentData } from './useTalentData'

function App() {
  // 우리가 만든 로봇(useTalentData)을 불러와서 작동시킵니다.
  const { talents, isLoading, error } = useTalentData()

  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 mb-8">
          KONEXA DB 연동 테스트 🚀
        </h1>

        {/* 1. 로딩 중일 때 보여줄 화면 */}
        {isLoading && <p className="text-blue-600">데이터를 불러오는 중입니다...</p>}

        {/* 2. 에러가 났을 때 보여줄 화면 */}
        {error && <p className="text-red-600">에러 발생: {error}</p>}

        {/* 3. 데이터가 성공적으로 도착했을 때 보여줄 화면 */}
        {!isLoading && !error && talents.length === 0 && (
          <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
            <p className="text-zinc-500">연동은 성공했지만, 아직 Supabase 창고에 등록된 인재 데이터가 없습니다!</p>
          </div>
        )}

        {!isLoading && !error && talents.length > 0 && (
          <div className="grid gap-4">
            {talents.map((talent) => (
              <div key={talent.id} className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
                <p className="font-semibold text-lg">인재 ID: {talent.id}</p>
                <p className="text-zinc-600">비자 점수: {talent.visa_score}점</p>
                <p className="text-zinc-600">보유 기술: {talent.tech_stack?.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
