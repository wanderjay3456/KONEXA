import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

interface Talent {
  id: string;
  tech_stack: string[];
  visa_score: number;
  is_verified: boolean;
  name?: string; // DB에 이름 컬럼이 있다면 사용
}

function App() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTalents() {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select('*');
      
      if (!error && data) setTalents(data);
      setLoading(false);
    }
    fetchTalents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <nav className="bg-blue-600 p-4 text-white shadow-lg">
        <div className="max-container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">KONEXA 🚀</h1>
          <div className="space-x-4">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium">인재 등록</button>
            <button className="border border-white px-4 py-2 rounded-lg font-medium">기업 로그인</button>
          </div>
        </div>
      </nav>

      {/* 메인 섹션 */}
      <main className="max-w-6xl mx-auto p-8">
        <header className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">글로벌 인재를 혁신으로 연결합니다</h2>
          <p className="text-xl text-gray-600">검증된 해외 IT 인재와 한국의 스타트업을 매칭하는 가장 빠른 방법</p>
        </header>

        {/* 인재 카드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-center col-span-full">데이터를 불러오는 중...</p>
          ) : talents.length > 0 ? (
            talents.map((talent) => (
              <div key={talent.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                    비자 점수: {talent.visa_score}점
                  </div>
                  {talent.is_verified && (
                    <span className="text-green-500 text-sm font-medium flex items-center">
                      ✓ 검증됨
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">글로벌 인재 #{talent.id.slice(0, 5)}</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {talent.tech_stack?.map((tech, idx) => (
                    <span key={idx} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                <button className="w-full mt-6 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors">
                  프로필 상세보기
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">아직 등록된 인재가 없습니다. DB에 데이터를 넣어주세요!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;